import { NextRequest, NextResponse } from 'next/server';
import { proxyRequest } from '../../proxy-utils';

export async function POST(request: NextRequest): Promise<NextResponse> {
  console.log('[API Route] Register request received');
  
  try {
    // Read the request body to log it for debugging
    const body = await request.json();
    console.log('[API Route] Register request body:', JSON.stringify(body));
    
    // Make sure we're sending only the fields expected by the backend
    const formattedBody = {
      username: body.username,
      email: body.email,
      password: body.password
    };
    
    console.log('[API Route] Formatted request body:', JSON.stringify(formattedBody));
    
    // Clone the request for the proxy since we've consumed the body
    const clonedRequest = new NextRequest(request.url, {
      headers: request.headers,
      method: request.method,
      body: JSON.stringify(formattedBody),
      duplex: 'half',
    });
    
    const response = await proxyRequest(clonedRequest, '/api/v1/auth/register/');
    console.log('[API Route] Register response status:', response.status);
    
    return response;
  } catch (error) {
    console.error('[API Route] Register error:', error);
    return NextResponse.json(
      { success: false, message: 'Registration request failed' },
      { status: 500 }
    );
  }
} 