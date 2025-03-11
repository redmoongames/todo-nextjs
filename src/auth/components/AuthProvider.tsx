'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthService } from '../AuthService';
import { AuthState, AuthContextType } from '../types';

// Initialize the AuthService
const authService = AuthService.getInstance();

// Create a combined context that includes both the service and state
interface AuthContextValue extends AuthContextType {
  authService: AuthService;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null
  });

  const router = useRouter();
  const pathname = usePathname();

  // Check authentication status on mount and when pathname changes
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setAuthState(prev => ({ ...prev, isLoading: true }));
        
        // If we're on the login page, clear stale tokens
        if (pathname.includes('/login')) {
          authService.clearStaleTokensOnLoginPage();
        }
        
        // Check if we have an access token
        const accessToken = authService.getAccessToken();
        
        if (!accessToken) {
          console.debug("[DEBUG] No access token found");
          setAuthState(prev => ({ 
            ...prev, 
            isAuthenticated: false, 
            user: null, 
            isLoading: false 
          }));
          return;
        }
        
        // Check if token needs refresh before verifying
        if (authService.needsTokenRefresh()) {
          console.debug("[DEBUG] Token needs refresh, attempting to refresh");
          const refreshed = await authService.refreshAccessToken();
          if (!refreshed) {
            console.debug("[DEBUG] Token refresh failed");
            setAuthState(prev => ({ 
              ...prev, 
              isAuthenticated: false, 
              user: null, 
              isLoading: false 
            }));
            return;
          }
        }
        
        // Verify the token
        const isValid = await authService.verifyToken();
        
        if (!isValid) {
          console.debug("[DEBUG] Token verification failed");
          setAuthState(prev => ({ 
            ...prev, 
            isAuthenticated: false, 
            user: null, 
            isLoading: false 
          }));
          return;
        }
        
        // Get user data
        const user = authService.getUser();
        
        setAuthState(prev => ({ 
          ...prev, 
          isAuthenticated: true, 
          user, 
          isLoading: false 
        }));
        
      } catch (error) {
        console.error("[DEBUG] Auth check error:", error);
        setAuthState(prev => ({ 
          ...prev, 
          isAuthenticated: false, 
          user: null, 
          error: error instanceof Error ? error.message : 'Authentication error',
          isLoading: false 
        }));
      }
    };
    
    checkAuth();
  }, [pathname]);

  const login = useCallback(async (username: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await authService.login(username, password);
      
      if (response.success && response.data) {
        setAuthState({
          isAuthenticated: true,
          user: response.data.user,
          isLoading: false,
          error: null
        });
        return true;
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      setAuthState(prev => ({ 
        ...prev, 
        isAuthenticated: false, 
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false 
      }));
      return false;
    }
  }, []);

  const register = useCallback(async (username: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await authService.register(username, password);
      
      if (response.success && response.data) {
        setAuthState({
          isAuthenticated: true,
          user: response.data.user,
          isLoading: false,
          error: null
        });
        return true;
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      setAuthState(prev => ({ 
        ...prev, 
        isAuthenticated: false, 
        error: error instanceof Error ? error.message : 'Registration failed',
        isLoading: false 
      }));
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      await authService.logout();
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null
      });
      
      return true;
    } catch (error) {
      console.error("[DEBUG] Logout error:", error);
      
      // Even if the API call fails, we still want to clear local state
      authService.clearTokens();
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null
      });
      
      return true;
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const refreshed = await authService.refreshAccessToken();
      
      if (refreshed) {
        const user = authService.getUser();
        
        setAuthState(prev => ({ 
          ...prev, 
          isAuthenticated: true, 
          user
        }));
        
        return true;
      }
      
      setAuthState(prev => ({ 
        ...prev, 
        isAuthenticated: false, 
        user: null
      }));
      
      return false;
    } catch (error) {
      console.error("[DEBUG] Token refresh error:", error);
      
      setAuthState(prev => ({ 
        ...prev, 
        isAuthenticated: false, 
        user: null,
        error: error instanceof Error ? error.message : 'Token refresh failed'
      }));
      
      return false;
    }
  }, []);

  const getAccessToken = useCallback(() => {
    return authService.getAccessToken();
  }, []);

  // Combine the auth state and service into a single context value
  const value: AuthContextValue = {
    ...authState,
    login,
    register,
    logout,
    refreshToken,
    getAccessToken,
    authService
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 