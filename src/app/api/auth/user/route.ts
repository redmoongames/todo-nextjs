import { NextRequest, NextResponse } from 'next/server';
import { forwardToBackend } from '../../ProxyUtils';

export async function GET(request: NextRequest): Promise<NextResponse> {
  return forwardToBackend(request, '/api/v1/auth/user/');
} 