import { NextRequest, NextResponse } from 'next/server';
import { proxyRequest } from '../../proxy-utils';

export async function GET(request: NextRequest): Promise<NextResponse> {
  return proxyRequest(request, '/api/v1/auth/user/');
} 