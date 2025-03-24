import { NextRequest, NextResponse } from 'next/server';
import { forwardToBackend } from '../../ProxyUtils';

export async function POST(request: NextRequest): Promise<NextResponse> {
  console.log('[login] Request received');
  return forwardToBackend(request, '/api/v1/auth/login/');
} 