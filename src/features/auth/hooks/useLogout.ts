import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authenticationService } from '../services';

/**
 * Hook for handling user logout functionality
 * @returns Logout method and related states
 */
export function useLogout() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const logout = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await authenticationService.logout();
      
      setIsLoading(false);
      
      if (result.success && result.redirect) {
        router.push(result.redirect);
      }
      
      return result.success;
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      return false;
    }
  };

  return {
    logout,
    isLoading,
    error,
    clearError: () => setError(null)
  };
} 