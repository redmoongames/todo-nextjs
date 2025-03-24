import { NextRequest, NextResponse } from 'next/server';
import { forwardToBackend } from '../../ProxyUtils';

export async function POST(request: NextRequest): Promise<NextResponse> {
  return forwardToBackend(request, '/api/v1/auth/register/');
} 