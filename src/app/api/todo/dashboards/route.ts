import { NextRequest, NextResponse } from 'next/server';
import { proxyRequest } from '../../ProxyUtils';

export async function GET(request: NextRequest): Promise<NextResponse> {
  return proxyRequest(request, '/api/v1/todo/dashboards/');
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const modifiedRequest = addDebugHeaders(request);
    const response = await proxyRequest(modifiedRequest, '/api/v1/todo/dashboards/');
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to process dashboard creation request' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  console.log('[API ROUTE] deleting dashboard', request);
  return proxyRequest(request, '/api/v1/todo/dashboards/');
}


function addDebugHeaders(request: NextRequest): NextRequest {
  const headers = new Headers(request.headers);
  headers.set('X-Debug-Info', 'Processed by Next.js API route');
  
  return new NextRequest(request.url, {
    method: request.method,
    headers,
    body: request.body,
    cache: request.cache,
    credentials: request.credentials,
    integrity: request.integrity,
    keepalive: request.keepalive,
    mode: request.mode,
    redirect: request.redirect,
    referrer: request.referrer,
    referrerPolicy: request.referrerPolicy,
    signal: request.signal,
  });
} 