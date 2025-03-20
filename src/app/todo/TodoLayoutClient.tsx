'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AuthWrapper } from '@/shared/auth/auth-context';
import { SlideMenuWrapper } from '@/shared/components/slideMenu/SlideMenuWrapper';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';

interface TodoLayoutClientProps {
  children: React.ReactNode;
}

export default function TodoLayoutClient({ children }: TodoLayoutClientProps) {
  const router = useRouter();
  const [showAuthError, setShowAuthError] = useState(false);
  
  const handleAuthSuccess = () => {
    console.debug("[TODO LAYOUT] User is authenticated, showing todo layout");
  };
  
  const handleAuthFail = () => {
    console.debug("[TODO LAYOUT] Authentication required, redirecting to login");
    setShowAuthError(true);
    
    // Redirect to login after a brief delay
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  };
  
  // Custom loading component
  const loadingFallback = (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <LoadingSpinner size="large" text="Loading your todo list..." />
    </div>
  );
  
  // Custom auth error component
  const authErrorFallback = (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
      <p className="mb-4">You need to be logged in to access this page.</p>
      <LoadingSpinner size="small" text="Redirecting to login page..." />
    </div>
  );
  
  return (
    <AuthWrapper 
      onAuthSuccess={handleAuthSuccess}
      onAuthFail={handleAuthFail}
      fallbackComponent={showAuthError ? authErrorFallback : undefined}
    >
      <SlideMenuWrapper>
        {children}
      </SlideMenuWrapper>
    </AuthWrapper>
  );
} 