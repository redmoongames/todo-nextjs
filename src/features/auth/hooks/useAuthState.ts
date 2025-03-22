import { useState, useCallback, useEffect, useRef } from 'react';
import { User } from '../types';
import { sessionService, authenticationService } from '../services';
import { useRouter } from 'next/navigation';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Main authentication hook that manages user session state
 * @returns Authentication state and methods for session management
 */
export function useAuthState() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });
  const router = useRouter();
  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const result = await sessionService.checkSession();
      
      setAuthState({
        user: result.user,
        isAuthenticated: result.isAuthenticated,
        isLoading: false,
        error: null
      });
      
      return result.isAuthenticated;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication check failed';
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage
      });
      
      return false;
    }
  }, []);

  // Initial auth check
  useEffect(() => {
    // Clear any existing timeout
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
    }
    
    checkAuth();
    
    // Set up periodic check for long-running sessions
    checkTimeoutRef.current = setInterval(() => {
      checkAuth();
    }, 5 * 60 * 1000); // Check every 5 minutes
    
    return () => {
      if (checkTimeoutRef.current) {
        clearInterval(checkTimeoutRef.current);
      }
    };
  }, [checkAuth]);

  const updateUser = useCallback((user: User | null) => {
    setAuthState(prev => ({
      ...prev,
      user,
      isAuthenticated: !!user,
      isLoading: false
    }));
  }, []);

  const logout = useCallback(async (): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const result = await authenticationService.logout();
      
      if (result.success) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
        
        if (result.redirect) {
          router.replace(result.redirect);
        }
      } else {
        setAuthState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Logout failed'
        }));
      }
      
      return result.success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      
      return false;
    }
  }, [router]);

  return {
    ...authState,
    checkAuth,
    updateUser,
    logout
  };
} 