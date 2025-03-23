import { NextRequest, NextResponse } from 'next/server';

export function getApiUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://api.redmen.store';
  const url = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
  return url;
}

function extractCsrfToken(cookieString: string | null): string | null {
  if (!cookieString) return null;
  
  const csrfMatches = cookieString.match(/csrftoken=([^;]+)/) || cookieString.match(/csrf_token=([^;]+)/);
  
  if (csrfMatches && csrfMatches[1]) {
    return csrfMatches[1];
  }
  
  return null;
}

export async function handleApiError(error: unknown): Promise<NextResponse> {
  if (error instanceof Response) {
    try {
      const data = await error.json();
      return NextResponse.json(
        { success: false, message: data.message || 'Request failed' },
        { status: error.status }
      );
    } catch {
      return NextResponse.json(
        { success: false, message: 'Request failed' },
        { status: error.status }
      );
    }
  }
  
  return NextResponse.json(
    { success: false, message: 'An unexpected error occurred' },
    { status: 500 }
  );
}

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  message?: string;
};

export async function proxyRequest(
  request: NextRequest,
  endpoint: string,
  options: {
    method?: string;
    stripPrefix?: string;
  } = {}
): Promise<NextResponse> {
  const { method = request.method } = options;
  
  try {
    const API_URL = getApiUrl();
    
    let body;
    const contentType = request.headers.get('content-type');
    
    if (method !== 'GET' && method !== 'HEAD' && contentType?.includes('application/json')) {
      try {
        body = await request.json();
      } catch {
        body = undefined;
      }
    }
    
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    });
    
    const cookies = request.headers.get('cookie');
    if (cookies) {
      headers.set('Cookie', cookies);
      
      const csrfToken = extractCsrfToken(cookies);
      if (csrfToken && (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE')) {
        headers.set('X-CSRFToken', csrfToken);
        headers.set('X-CSRF-TOKEN', csrfToken);
        headers.set('CSRF-Token', csrfToken);
      }
    }
    
    if (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE') {
      try {
        const apiUrlObj = new URL(API_URL);
        headers.set('Origin', apiUrlObj.origin);
        headers.set('Referer', API_URL);
      } catch (e) {
        // Continue without setting Origin header
      }
    }
    
    const targetUrl = `${API_URL}${endpoint}`;
    
    let response: Response;
    
    if (body) {
      const requestBody = JSON.stringify(body);
      
      response = await fetch(targetUrl, {
        method,
        headers,
        body: requestBody,
        credentials: 'include',
      });
    } else {
      response = await fetch(targetUrl, {
        method,
        headers,
        credentials: 'include',
      });
    }
    
    const responseStatus = response.status;
    const responseCookies = response.headers.getSetCookie();
    
    const responseText = await response.text();
    const responseContentType = response.headers.get('content-type') || '';
    
    if (responseContentType.includes('text/html') && responseStatus >= 400) {
      let errorDetails = 'Unknown error';
      if (responseText.includes('CSRF verification failed')) {
        const reasonSection = responseText.split('Reason given for failure:')[1];
        if (reasonSection) {
          const preContent = reasonSection.split('<pre>')[1];
          if (preContent) {
            const reason = preContent.split('</pre>')[0].trim();
            errorDetails = `CSRF verification failed: ${reason}`;
          } else {
            errorDetails = 'CSRF verification failed';
          }
        } else {
          errorDetails = 'CSRF verification failed';
        }
      }
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Error response from server', 
          error: errorDetails
        }, 
        { status: responseStatus }
      );
    }
    
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
    
    const newResponse = NextResponse.json(responseData, { status: response.status });
    
    responseCookies.forEach((cookie: string) => {
      newResponse.headers.append('Set-Cookie', cookie);
    });
    
    return newResponse;
  } catch (error) {
    return handleApiError(error);
  }
} 