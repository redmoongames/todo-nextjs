'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clientAuthService, User, AuthState } from './client-auth-service';
import { LoadingSpinner } from '../../shared/components/ui/LoadingSpinner';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, email: string, password: string, confirmPassword: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateAuthState: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  updateAuthState: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(initialState);
  const router = useRouter();

  const updateAuthState = async (): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const { isAuthenticated, user } = await clientAuthService.checkSession();
      
      setAuthState({
        user,
        isAuthenticated,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Authentication check failed'
      });
    }
  };

  // Check auth state on mount
  useEffect(() => {
    updateAuthState();
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log(`[AuthContext] Login attempt for ${username}`);
      
      if (!username || !password) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Username and password are required'
        }));
        return { success: false, message: 'Username and password are required' };
      }
      
      const result = await clientAuthService.login({
        username,
        password
      });
      
      if (result.success) {
        // Update auth state after successful login
        await updateAuthState();
        return result;
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: result.message || 'Login failed'
        }));
        return result;
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed'
      }));
      return { success: false };
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const result = await clientAuthService.register({
        username,
        email,
        password,
        confirmPassword
      });
      
      if (result.success) {
        // Update auth state after successful registration
        await updateAuthState();
        return result;
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: result.message || 'Registration failed'
        }));
        return result;
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registration failed'
      }));
      return { success: false };
    }
  };

  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const result = await clientAuthService.logout();
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
      
      if (result.redirect) {
        router.push(result.redirect);
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Logout failed'
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        updateAuthState
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthWrapper({ 
  children,
  onAuthSuccess,
  onAuthFail,
  fallbackComponent
}: { 
  children: React.ReactNode;
  onAuthSuccess?: () => void;
  onAuthFail?: () => void;
  fallbackComponent?: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, error } = useAuth();
  
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