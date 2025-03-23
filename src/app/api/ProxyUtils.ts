import { NextRequest, NextResponse } from 'next/server';

export function getApiUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://api.redmen.store';
  const url = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
  return url;
}

// Function to extract CSRF token from cookies
function extractCsrfToken(cookieString: string | null): string | null {
  if (!cookieString) return null;
  
  // Django uses both formats: csrftoken and csrf_token
  const csrfMatches = cookieString.match(/csrftoken=([^;]+)/) || cookieString.match(/csrf_token=([^;]+)/);
  
  if (csrfMatches && csrfMatches[1]) {
    console.log('Found CSRF token in cookies');
    return csrfMatches[1];
  }
  
  console.log('No CSRF token found in cookies:', cookieString);
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
      
      // Extract CSRF token from cookies and set it in the header
      const csrfToken = extractCsrfToken(cookies);
      if (csrfToken && (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE')) {
        console.log('Setting X-CSRFToken header:', csrfToken.substring(0, 6) + '...');
        headers.set('X-CSRFToken', csrfToken);
        
        // Django also accepts the token in these alternative header formats
        headers.set('X-CSRF-TOKEN', csrfToken);
        headers.set('CSRF-Token', csrfToken);
      } else if (method !== 'GET' && method !== 'HEAD') {
        console.warn('No CSRF token found in cookies for non-GET request');
      }
    } else if (method !== 'GET' && method !== 'HEAD') {
      console.warn('No cookies found for non-GET request - CSRF protection may fail');
    }
    
    // Set Origin and Referer headers to match the API URL to pass CSRF origin check
    if (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE') {
      try {
        const apiUrlObj = new URL(API_URL);
        headers.set('Origin', apiUrlObj.origin);
        headers.set('Referer', API_URL);
        console.log(`Set Origin header to: ${apiUrlObj.origin}`);
      } catch (e) {
        console.warn('Failed to parse API URL for Origin header:', e);
      }
    }
    
    const targetUrl = `${API_URL}${endpoint}`;
    
    console.log(`Proxying ${method} request to: ${targetUrl}`);
    if (method !== 'GET' && method !== 'HEAD') {
      console.log('Request body:', body);
      console.log('Headers:', Object.fromEntries([...headers.entries()]));
    }
    
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
    console.log(`Response status from backend: ${responseStatus}`);
    
    const responseCookies = response.headers.getSetCookie();
    
    const responseText = await response.text();
    const responseContentType = response.headers.get('content-type') || '';
    
    // If we received an HTML response, especially for errors
    if (responseContentType.includes('text/html') && responseStatus >= 400) {
      console.error('HTML error response received:');
      console.error('----- HTML ERROR RESPONSE START -----');
      
      // For CSRF errors, we want to see the full message
      if (responseText.includes('CSRF verification failed')) {
        console.error(responseText);
      } else {
        // For other errors, just show a preview
        console.error(responseText.substring(0, 1000));
        if (responseText.length > 1000) {
          console.error('... (truncated)');
        }
      }
      console.error('----- HTML ERROR RESPONSE END -----');
      
      // Extract the reason for CSRF failure if present
      let errorDetails = 'Unknown error';
      if (responseText.includes('CSRF verification failed')) {
        // Extract the reason without using the 's' flag (dotAll)
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
    console.error('Proxy request error:', error);
    return handleApiError(error);
  }
} 