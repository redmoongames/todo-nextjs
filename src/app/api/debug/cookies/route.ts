import { NextRequest, NextResponse } from 'next/server';

// GET /api/debug/cookies
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const cookies = request.headers.get('cookie');
    
    interface DebugResult {
      hasCookies: boolean;
      cookieCount: number;
      cookies: Record<string, string>;
      csrfToken: null | {
        exists: boolean;
        length: number;
        preview: string;
      };
      headers: Record<string, string>;
    }
    
    const result: DebugResult = {
      hasCookies: !!cookies,
      cookieCount: 0,
      cookies: {},
      csrfToken: null,
      headers: {}
    };
    
    if (cookies) {
      // Parse cookies into object
      const cookieObj: Record<string, string> = {};
      const cookiesList = cookies.split(';').map(c => c.trim());
      
      result.cookieCount = cookiesList.length;
      
      cookiesList.forEach(cookie => {
        const [name, value] = cookie.split('=');
        if (name && value) {
          cookieObj[name] = value;
          
          // Include only safe cookies in the output
          if (['csrftoken', 'csrf_token', 'sessionid'].includes(name)) {
            result.cookies[name] = value.substring(0, 6) + '...';
          } else {
            result.cookies[name] = '(value hidden)';
          }
        }
      });
      
      // Check for CSRF tokens
      const csrfToken = cookieObj['csrftoken'] || cookieObj['csrf_token'];
      if (csrfToken) {
        result.csrfToken = {
          exists: true,
          length: csrfToken.length,
          preview: csrfToken.substring(0, 6) + '...'
        };
      }
    }
    
    // Add headers from request
    request.headers.forEach((value, key) => {
      if (['cookie', 'authorization'].includes(key.toLowerCase())) {
        result.headers[key] = '(value hidden)';
      } else {
        result.headers[key] = value;
      }
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in cookie debug endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to process cookie debug request' },
      { status: 500 }
    );
  }
} 