import { NextResponse } from 'next/server';

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  message?: string;
};

export function getApiUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://api.redmen.store';
  
  const url = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
  console.log(`[API Utils] Using API URL: ${url}`);
  return url;
}

export async function handleApiError(error: unknown): Promise<NextResponse> {
  console.error('API Error:', error);
  
  if (error instanceof Response) {
    try {
      const data = await error.json();
      return NextResponse.json(
        { success: false, message: data.message || 'Request failed' },
        { status: error.status }
      );
    } catch {
      return NextResponse.json(
        { success: false, message: 'Request failed' },
        { status: error.status }
      );
    }
  }
  
  return NextResponse.json(
    { success: false, message: 'An unexpected error occurred' },
    { status: 500 }
  );
} 