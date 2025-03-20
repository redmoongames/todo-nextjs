import { NextRequest, NextResponse } from 'next/server';
import { getApiUrl } from '../../utils';

export async function POST(request: NextRequest): Promise<NextResponse> {
  console.log('[API Route] Login request received');
  
  try {
    // Get the API URL
    const API_URL = getApiUrl();
    
    // Read the request body
    let body;
    try {
      body = await request.json();
      console.log('[API Route] Original request body:', JSON.stringify(body));
    } catch (e) {
      console.error('[API Route] Error parsing request JSON:', e);
      return NextResponse.json(
        { success: false, message: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Prepare the credentials in the format the backend expects
    const loginData = {
      username: body.username,
      password: body.password
    };
    
    console.log('[API Route] Request data:', { 
      username: loginData.username
    });
    
    // Validate required fields
    if (!loginData.username || !loginData.password) {
      console.error('[API Route] Missing required fields:', loginData);
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    console.log('[API Route] Formatted request body:', JSON.stringify(loginData));
    
    // Copy headers
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    
    // Forward cookies
    const cookies = request.headers.get('cookie');
    if (cookies) {
      headers.set('Cookie', cookies);
      console.log(`[API Route] Forwarding cookies: ${cookies}`);
    }
    
    // Make the direct request to the backend
    const targetUrl = `${API_URL}/api/v1/auth/login/`;
    console.log(`[API Route] Sending request to ${targetUrl} with body:`, JSON.stringify(loginData));
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(loginData),
      credentials: 'include',
    });
    
    console.log(`[API Route] Response status: ${response.status} ${response.statusText}`);
    
    // Get the response text
    const responseText = await response.text();
    console.log(`[API Route] Raw response text:`, responseText.substring(0, 200));
    
    // Parse the response
    let responseData;
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
      console.log(`[API Route] Parsed response data:`, responseData);
    } catch (e) {
      console.error(`[API Route] Error parsing response JSON:`, e);
      responseData = { 
        success: false, 
        message: 'Invalid response from server' 
      };
    }
    
    // Extract cookies
    const responseCookies = response.headers.getSetCookie();
    if (responseCookies.length > 0) {
      console.log(`[API Route] Received cookies from API: ${responseCookies.length} cookies`);
    }
    
    // Create the response
    const newResponse = NextResponse.json(responseData, { status: response.status });
    
    // Forward cookies
    responseCookies.forEach((cookie: string) => {
      newResponse.headers.append('Set-Cookie', cookie);
    });
    
    return newResponse;
  } catch (error) {
    console.error('[API Route] Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Login request failed' },
      { status: 500 }
    );
  }
} 