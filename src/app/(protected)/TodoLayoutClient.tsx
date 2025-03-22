'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthState } from '@/features/auth/hooks/useAuthState';
import { SlideMenuWrapper } from '@/features/todo/components/menu';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';

interface TodoLayoutClientProps {
  children: React.ReactNode;
}

export default function TodoLayoutClient({ children }: TodoLayoutClientProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthState();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      const currentPath = window.location.pathname;
      router.replace(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
    }
  }, [isAuthenticated, isLoading, router]);
  
  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" text="Loading..." />
      </div>
    );
  }
  
  // Don't render anything until authentication is confirmed
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" text="Checking authorization..." />
      </div>
    );
  }
  
  // Render the protected content if authenticated
  return (
    <SlideMenuWrapper>
      {children}
    </SlideMenuWrapper>
  );
} 