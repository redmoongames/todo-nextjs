import { NextResponse } from 'next/server';

// Middleware is disabled because we're now using client-side authentication only
export async function middleware() {
  return NextResponse.next();
}

// Use minimal matcher to avoid performance issues
export const config = {
  matcher: ['/api/:path*'],
};