'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

/**
 * Props for the AuthWrapper component
 */
interface AuthWrapperProps {
  /** Child components to render when authentication is complete */
  children: React.ReactNode;
  /** Message to display while authentication is being checked */
  loadingMessage?: string;
  /** Optional callback function to execute when authentication is successful */
  onAuthSuccess?: () => void;
  /** Whether to protect the content and only show it to authenticated users */
  isProtectContent?: boolean;
  /** Optional callback function to execute when authentication fails */
  onAuthFail?: () => void;
}

/**
 * A wrapper component that handles authentication state and loading.
 * 
 * This component:
 * - Shows a loading spinner while authentication state is being determined
 * - Executes a callback when authentication is successful
 * - Executes a callback when authentication fails (if isProtectContent is true)
 * - Renders children only when authentication check is complete
 * 
 * @param {AuthWrapperProps} props - Component props
 * @returns {JSX.Element} The rendered component
 * 
 * @example
 * <AuthWrapper
 *   loadingMessage="Checking authentication..."
 *   onAuthSuccess={() => console.log('User is authenticated')}
 *   isProtectContent={true}
 *   onAuthFail={() => router.push('/login')}
 * >
 *   <ProtectedContent />
 * </AuthWrapper>
 */
const AuthWrapper = ({ 
  children, 
  loadingMessage = 'Loading...', 
  onAuthSuccess,
  isProtectContent = false,
  onAuthFail
}: AuthWrapperProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    
    if (isAuthenticated && onAuthSuccess) {
      onAuthSuccess();
    } else if (!isAuthenticated && isProtectContent && onAuthFail) {
      onAuthFail();
    }
    
    setIsReady(true);
  }, [isLoading, isAuthenticated, onAuthSuccess, isProtectContent, onAuthFail]);

  if (isLoading || !isReady) {
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
  if (isProtectContent && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default AuthWrapper; 