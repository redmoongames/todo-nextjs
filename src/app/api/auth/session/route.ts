import { NextRequest, NextResponse } from 'next/server';
import { proxyRequest } from '../../proxy-utils';

export async function GET(request: NextRequest): Promise<NextResponse> {
  console.log('[API Route] Session check requested');
  
  try {
    const response = await proxyRequest(request, '/api/v1/auth/session/');
    console.log('[API Route] Session check response status:', response.status);
    return response;
  } catch (error) {
    console.error('[API Route] Session check error:', error);
    return NextResponse.json(
      { success: false, message: 'Session check failed' },
      { status: 500 }
    );
  }
} 