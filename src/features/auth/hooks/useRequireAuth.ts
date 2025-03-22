import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from './useAuthState';

/**
 * Hook to protect routes that require authentication
 * Automatically redirects unauthenticated users to login
 * @param redirectTo - Path to redirect unauthenticated users (default: '/login')
 * @returns Authentication state for conditionally rendering components
 */
export function useRequireAuth(redirectTo: string = '/login') {
  const { isAuthenticated, isLoading } = useAuthState();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  return { isAuthenticated, isLoading };
} 