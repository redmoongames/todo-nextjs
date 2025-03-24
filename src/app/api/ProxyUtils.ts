import { NextRequest, NextResponse } from 'next/server';

interface ApiConfig {
  baseUrl: string;
  credentials: RequestCredentials;
}

class ApiClient {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  private getHeaders(request: NextRequest, method: string): Headers {
    const headers = new Headers();
    
    request.headers.forEach((value, key) => {
      if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    });

    const cookies = request.headers.get('cookie');
    if (cookies) {
      headers.set('Cookie', cookies);
      this.setCsrfHeaders(headers, cookies, method);
    }

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      this.setSecurityHeaders(headers);
    }

    return headers;
  }

  private setCsrfHeaders(headers: Headers, cookies: string, method: string): void {
    const csrfToken = this.extractCsrfToken(cookies);
    if (csrfToken && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      headers.set('X-CSRFToken', csrfToken);
      headers.set('X-CSRF-TOKEN', csrfToken);
      headers.set('CSRF-Token', csrfToken);
    }
  }

  private setSecurityHeaders(headers: Headers): void {
    try {
      const apiUrlObj = new URL(this.config.baseUrl);
      headers.set('Origin', apiUrlObj.origin);
      headers.set('Referer', this.config.baseUrl);
    } catch {
      // Continue without setting Origin header
    }
  }

  private extractCsrfToken(cookieString: string): string | null {
    const csrfMatches = cookieString.match(/csrftoken=([^;]+)/) || cookieString.match(/csrf_token=([^;]+)/);
    return csrfMatches?.[1] || null;
  }

  async forwardRequest(request: NextRequest, endpoint: string, method: string = request.method): Promise<Response> {
    const headers = this.getHeaders(request, method);
    const targetUrl = `${this.config.baseUrl}${endpoint}`;
    
    let body;
    const contentType = request.headers.get('content-type');
    if (method !== 'GET' && method !== 'HEAD' && contentType?.includes('application/json')) {
      try {
        body = await request.json();
      } catch {
        body = undefined;
      }
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
      credentials: this.config.credentials,
    };

    if (body) {
      fetchOptions.body = JSON.stringify(body);
    }

    return fetch(targetUrl, fetchOptions);
  }
}

class ProxyHandler {
  private apiClient: ApiClient;

  constructor(apiUrl: string) {
    this.apiClient = new ApiClient({
      baseUrl: apiUrl,
      credentials: 'include'
    });
  }

  private async handleHtmlError(response: Response, responseText: string): Promise<NextResponse> {
    let errorDetails = 'Unknown error';
    if (responseText.includes('CSRF verification failed')) {
      const reasonSection = responseText.split('Reason given for failure:')[1];
      if (reasonSection) {
        const preContent = reasonSection.split('<pre>')[1];
        if (preContent) {
          const reason = preContent.split('</pre>')[0].trim();
          errorDetails = `CSRF verification failed: ${reason}`;
        }
      }
    }

    return NextResponse.json(
      { success: false, message: 'Error response from server', error: errorDetails },
      { status: response.status }
    );
  }

  private async handleJsonResponse(response: Response, responseText: string): Promise<NextResponse> {
    let responseData;
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch {
      responseData = {
        success: false,
        message: 'Invalid response from server',
        error: `Failed to parse response: ${responseText.substring(0, 100)}...`
      };
    }

    const nextResponse = NextResponse.json(responseData, { status: response.status });
    response.headers.getSetCookie().forEach(cookie => {
      nextResponse.headers.append('Set-Cookie', cookie);
    });

    return nextResponse;
  }

  async handleRequest(request: NextRequest, endpoint: string, method: string = request.method): Promise<NextResponse> {
    try {
      console.log('[ProxyHandler] Forwarding request to:', endpoint);
      const response = await this.apiClient.forwardRequest(request, endpoint, method);
      const responseText = await response.text();
      const responseContentType = response.headers.get('content-type') || '';

      if (responseContentType.includes('text/html') && response.status >= 400) {
        return this.handleHtmlError(response, responseText);
      }

      return this.handleJsonResponse(response, responseText);
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: unknown): NextResponse {
    if (error instanceof Response) {
      return NextResponse.json(
        { success: false, message: 'Request failed' },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export function getBaseApiUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
  }
  return apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
}

export async function forwardToBackend(
  request: NextRequest,
  endpoint: string,
  options: { method?: string } = {}
): Promise<NextResponse> {
  const baseApiUrl = getBaseApiUrl();
  const handler = new ProxyHandler(baseApiUrl);
  return handler.handleRequest(request, endpoint, options.method);
} 