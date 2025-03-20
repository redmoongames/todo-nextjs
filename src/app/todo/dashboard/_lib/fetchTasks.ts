import { cookies } from 'next/headers';

export async function fetchTasks() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('auth_tokens');
  
  if (!authCookie?.value) {
    return null;
  }
  
  try {
    const authTokens = JSON.parse(authCookie.value);
    const accessToken = authTokens.access_token;
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://api.redmen.store'}/api/v1/todo/dashboards/1/todos/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.data?.items || null;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return null;
  }
} 