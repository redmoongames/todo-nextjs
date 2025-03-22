'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../AuthProvider';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';

interface AuthWrapperProps {
  children: React.ReactNode;
  onAuthSuccess?: () => void;
  onAuthFail?: () => void;
  fallbackComponent?: React.ReactNode;
}

export function AuthWrapper({ children, onAuthSuccess, onAuthFail, fallbackComponent }: AuthWrapperProps) {
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && onAuthSuccess) {
        onAuthSuccess();
      } else if (!isAuthenticated && onAuthFail) {
        onAuthFail();
      }
    }
  }, [isAuthenticated, isLoading, onAuthSuccess, onAuthFail]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="mb-4">You need to be logged in to access this page.</p>
        <button
          onClick={() => window.location.href = '/login'}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return <>{children}</>;
} 