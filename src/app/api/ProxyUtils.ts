import { NextRequest, NextResponse } from 'next/server';

export function getApiUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://api.redmen.store';
  const url = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
  return url;
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

export type ApiResponse<T = any> = {
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
    
    const responseCookies = response.headers.getSetCookie();
    
    const responseText = await response.text();
    
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