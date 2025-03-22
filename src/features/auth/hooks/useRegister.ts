import { useState } from 'react';
import { AuthResult, RegisterData } from '../types';
import { authenticationService } from '../services';

/**
 * Hook for handling user registration functionality
 * @returns Register method and related states
 */
export function useRegister() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: RegisterData): Promise<AuthResult> => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const result = await authenticationService.register(data);
      
      setIsSubmitting(false);
      
      if (!result.success) {
        setError(result.message || 'Registration failed');
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
    register,
    isSubmitting,
    error,
    clearError: () => setError(null)
  };
} 