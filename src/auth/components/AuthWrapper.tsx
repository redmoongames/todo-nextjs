'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';

interface AuthWrapperProps {
  children: React.ReactNode;
  isProtectContent?: boolean;
  loadingMessage?: string;
  onAuthSuccess?: () => void;
  onAuthFail?: () => void;
}

export function AuthWrapper({ 
  children, 
  isProtectContent = true,
  loadingMessage = 'Loading...',
  onAuthSuccess,
  onAuthFail
}: AuthWrapperProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      console.log('[AUTH WRAPPER] Path:', pathname);
      console.log('[AUTH WRAPPER] Is authenticated:', isAuthenticated);
      console.log('[AUTH WRAPPER] Is protected content:', isProtectContent);

      // Only handle redirects for protected content
      // Let the middleware handle auth page redirects
      if (isProtectContent && !isAuthenticated) {
        console.log('[AUTH WRAPPER] Unauthenticated user accessing protected content');
        // Redirect to login if not authenticated and content is protected
        if (onAuthFail) {
          onAuthFail();
        } else {
          router.push('/login');
        }
      } else if (isAuthenticated && onAuthSuccess && isProtectContent) {
        console.log('[AUTH WRAPPER] Authenticated user accessing protected content');
        // Call success callback if authenticated and content is protected
        onAuthSuccess();
      }
      setIsChecking(false);
    }
  }, [isLoading, isAuthenticated, isProtectContent, router, onAuthSuccess, onAuthFail, pathname]);

  if (isLoading || isChecking) {
    console.log('[AUTH WRAPPER] Loading or checking auth state');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  // If content is protected and user is not authenticated, don't render children
  // (this is a fallback in case the redirect hasn't happened yet)
  if (isProtectContent && !isAuthenticated) {
    console.log('[AUTH WRAPPER] Not rendering protected content for unauthenticated user');
    return null;
  }

  console.log('[AUTH WRAPPER] Rendering content');
  return <>{children}</>;
} 