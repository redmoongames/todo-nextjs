import { NextRequest, NextResponse } from 'next/server';
import { proxyRequest } from '../../proxy-utils';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const response = await proxyRequest(request, '/api/v1/auth/logout/');
  
  // After successful logout, redirect to login page
  if (response.status === 200) {
    // We can't redirect from an API route, so the client will handle this
    return NextResponse.json({ success: true, redirect: '/login' });
  }
  
  return response;
} 