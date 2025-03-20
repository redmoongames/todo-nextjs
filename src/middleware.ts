import { NextResponse, type NextRequest } from "next/server";

// Middleware is disabled because we're now using client-side session authentication
export async function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Use minimal matcher to avoid performance issues
export const config = {
  matcher: ['/api/:path*'],
};