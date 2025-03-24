import { useState } from 'react';
import { AuthResult, LoginCredentials } from '../types';
import { authenticationService } from '../services';
import { useAuthState } from './useAuthState';

/**
 * Hook for handling user login functionality
 * @returns Login method and related states
 */
export function useLogin() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { updateUser } = useAuthState();

  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    console.log('[useLogin] Login attempt with credentials:', credentials);
    if (!credentials.username || !credentials.password) {
      setError('Username and password are required');
      return { success: false, message: 'Username and password are required' };
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const result = await authenticationService.login(credentials);
      
      setIsSubmitting(false);
      
      if (!result.success) {
        setError(result.message || 'Login failed');
      } else if (result.user) {
        updateUser(result.user);
      }
      
      return result;
    } catch (error) {
      setIsSubmitting(false);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  return {
    login,
    isSubmitting,
    error,
    clearError: () => setError(null)
  };
} 