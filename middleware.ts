import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/todo", "/profile"];
const AUTH_PATHS = ["/login", "/register"];

function getApiUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    throw new Error(
      'NEXT_PUBLIC_API_URL environment variable is not defined. ' +
      'This is required for the middleware to verify authentication with the backend API.'
    );
  }
  
  return apiUrl;
}

async function verifyToken(accessToken: string | null | undefined): Promise<boolean> {
  if (!accessToken) {
    return false;
  }
  
  try {
    const API_URL = getApiUrl();
    
    const response = await fetch(`${API_URL}/auth/verify/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    
    const isAuthenticated = response.ok;
    
    if (!isAuthenticated) {
      console.error("[MIDDLEWARE] Token verification failed:", await response.text());
    }
    
    return isAuthenticated;
  } catch (error) {
    console.error("[MIDDLEWARE] Error verifying token:", error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookies = request.cookies;
  const authTokensCookie = cookies.get("auth_tokens")?.value;

  let isAuthenticated = false;

  if (authTokensCookie) {
    try {
      const authTokens = JSON.parse(authTokensCookie);
      const accessToken = authTokens.access_token;
      
      isAuthenticated = await verifyToken(accessToken);
    } catch (error) {
      console.error("[MIDDLEWARE] Error parsing auth tokens:", error);
      isAuthenticated = false;
    }
  }

  const isProtectedPath = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  if (isProtectedPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const isAuthPath = AUTH_PATHS.some((path) => pathname.startsWith(path));
  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/todo/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except for static files, api routes, and _next
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
