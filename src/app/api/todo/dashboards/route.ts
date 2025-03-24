import { NextRequest, NextResponse } from 'next/server';
import { forwardToBackend } from '../../ProxyUtils';

export async function GET(request: NextRequest): Promise<NextResponse> {
  return forwardToBackend(request, '/api/v1/todo/dashboards/');
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const modifiedRequest = addDebugHeaders(request);
    const response = await forwardToBackend(modifiedRequest, '/api/v1/todo/dashboards/');
    
    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: 'Failed to process dashboard creation request' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  return forwardToBackend(request, '/api/v1/todo/dashboards/');
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