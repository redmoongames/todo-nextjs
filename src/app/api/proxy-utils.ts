import { NextRequest, NextResponse } from 'next/server';
import { getApiUrl, handleApiError } from './utils';

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
    
    // Get the request body if it exists
    const contentType = request.headers.get('content-type');
    let body;
    
    if (method !== 'GET' && method !== 'HEAD' && contentType?.includes('application/json')) {
      try {
        body = await request.json();
        console.log(`[API Proxy] Request body:`, body);
      } catch (e) {
        console.error(`[API Proxy] Error parsing request JSON:`, e);
        // Continue with null body
      }
    }
    
    // Copy headers, but filter out headers like host, connection, etc.
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    });
    
    // Forward all cookies for session-based auth
    const cookies = request.headers.get('cookie');
    if (cookies) {
      headers.set('Cookie', cookies);
      console.log(`[API Proxy] Forwarding cookies: ${cookies}`);
    }
    
    // Create the target URL - use the endpoint directly
    const targetUrl = `${API_URL}${endpoint}`;
    
    // If we have a body, log it in detail for debugging
    if (body) {
      console.log(`[API Proxy] Sending request to ${targetUrl} with body:`, JSON.stringify(body));
    } else {
      console.log(`[API Proxy] ${method} ${targetUrl}`);
    }
    
    // Make the actual API request
    console.log(`[API Proxy] Making ${method} request to ${targetUrl}`);
    console.log(`[API Proxy] Request headers:`, Object.fromEntries([...headers.entries()]));
    
    let response: Response;
    
    if (body) {
      console.log(`[API Proxy] Request body (stringified):`, JSON.stringify(body));
      const requestBody = JSON.stringify(body);
      console.log(`[API Proxy] Final request body string:`, requestBody);
      
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
    
    console.log(`[API Proxy] Response status: ${response.status} ${response.statusText}`);
    
    // Extract cookies from response
    const responseCookies = response.headers.getSetCookie();
    if (responseCookies.length > 0) {
      console.log(`[API Proxy] Received cookies from API: ${responseCookies.length} cookies`);
    }
    
    // Get the response text first
    const responseText = await response.text();
    console.log(`[API Proxy] Raw response text:`, responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''));
    
    // Try to parse as JSON
    let responseData;
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
      console.log(`[API Proxy] Parsed response data:`, responseData);
    } catch (e) {
      console.error(`[API Proxy] Error parsing response JSON:`, e);
      responseData = { 
        success: false, 
        message: 'Invalid response from server',
        error: `Failed to parse response: ${responseText.substring(0, 100)}...`
      };
    }
    
    // Create a new response object
    const newResponse = NextResponse.json(responseData, { status: response.status });
    
    // Forward cookies from the backend
    responseCookies.forEach((cookie: string) => {
      newResponse.headers.append('Set-Cookie', cookie);
    });
    
    return newResponse;
  } catch (error) {
    console.error(`[API Proxy] Error during proxy request:`, error);
    return handleApiError(error);
  }
} 