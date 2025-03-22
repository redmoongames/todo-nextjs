import { NextRequest, NextResponse } from 'next/server';
import { proxyRequest } from '../../ProxyUtils';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const response = await proxyRequest(request, '/api/v1/auth/logout/');
  
  if (response.status === 200) {
    const responseData = await response.json();
    return NextResponse.json({ 
      ...responseData, 
      redirect: '/login' 
    }, { 
      status: response.status,
      headers: response.headers
    });
  }
  
  return response;
} 