'use client';

import { AuthWrapper } from '@/shared/auth/auth-context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';

export default function ProfilePage() {
  const router = useRouter();
  const [showAuthError, setShowAuthError] = useState(false);
  
  const handleAuthFail = () => {
    console.debug("[PROFILE] Authentication required, showing error message");
    setShowAuthError(true);
    
    // Redirect after 3 seconds
    setTimeout(() => {
      router.replace('/login');
    }, 3000);
  };
  
  // Custom auth error component
  const authErrorFallback = (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-red-900/80 p-8 rounded-lg max-w-md text-center">
        <h2 className="text-xl font-bold mb-4">Authentication Required</h2>
        <p className="mb-4">You need to be logged in to view this page.</p>
        <p className="text-sm text-gray-300">Redirecting to login page in 3 seconds...</p>
      </div>
    </div>
  );
  
  return (
    <AuthWrapper 
      onAuthFail={handleAuthFail}
      fallbackComponent={showAuthError ? authErrorFallback : undefined}
    >
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">User Profile</h1>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <p>Your profile content here...</p>
        </div>
      </div>
    </AuthWrapper>
  );
} 