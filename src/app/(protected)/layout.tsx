'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthState } from '@/features/auth/hooks/useAuthState';
import { SlideMenuWrapper } from '@/features/todo-planner/components/menu';
import { LoadingSpinner } from '@/common-ui/LoadingSpinner';

export default function TodoLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthState();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      const currentPath = window.location.pathname;
      router.replace(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
    }
  }, [isAuthenticated, isLoading, router]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <LoadingSpinner size="large" text="Loading..." />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <LoadingSpinner size="large" text="Checking authorization..." />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      <SlideMenuWrapper>
        {children}
      </SlideMenuWrapper>
    </div>
  );
}
