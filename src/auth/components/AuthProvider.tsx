'use client';

import { createContext, useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { AuthService } from '../utils/AuthService';
import { IAuthContext, IUser } from '../models';

const authService = AuthService.getInstance();

/**
 * React context for authentication state and actions.
 * This context is consumed by the useAuth hook.
 */
export const AuthContextInstance = createContext<IAuthContext | null>(null);

/**
 * Authentication Provider component that manages authentication state and provides
 * authentication methods to the entire application.
 * 
 * This component:
 * - Checks authentication status on mount and route changes
 * - Manages authentication state (isAuthenticated, isLoading, user, error)
 * - Provides methods for login, registration, logout, and token refresh
 * - Handles token expiration and automatic refresh
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components that will have access to auth context
 * 
 * @example
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<IUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pathname = usePathname();

  /**
   * Effect to check authentication status on mount and when pathname changes.
   * This ensures the auth state is always in sync with the current route.
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // If we're on the login page, clear tokens if they're expiring
        if (pathname.includes('/login')) {
          authService.clearTokensIfExpiring();
        }
        
        const accessToken = authService.getAccessToken();
        
        if (!accessToken) {
          setIsAuthenticated(false);
          setUser(null);
          setIsLoading(false);
          return;
        }
        
        if (authService.needsTokenRefresh()) {
          const refreshed = await authService.refreshAccessToken();
          if (!refreshed) {
            setIsAuthenticated(false);
            setUser(null);
            setIsLoading(false);
            return;
          }
        }
        
        const currentUser = authService.getUser();
        
        setIsAuthenticated(true);
        setUser(currentUser);
        setIsLoading(false);
        
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        setError(error instanceof Error ? error.message : 'Authentication error');
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [pathname]);

  /**
   * Authenticates a user with username and password.
   * 
   * @param {string} username - The user's username
   * @param {string} password - The user's password
   * @returns {Promise<boolean>} True if login was successful, false otherwise
   */
  const login = useCallback(async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.login(username, password);
      
      if (response.success && response.data) {
        setIsAuthenticated(true);
        setUser(response.data.user);
        setIsLoading(false);
        return true;
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      setIsAuthenticated(false);
      setError(error instanceof Error ? error.message : 'Login failed');
      setIsLoading(false);
      return false;
    }
  }, []);

  /**
   * Registers a new user with username and password.
   * 
   * @param {string} username - The desired username
   * @param {string} password - The desired password
   * @returns {Promise<boolean>} True if registration was successful, false otherwise
   */
  const register = useCallback(async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.register(username, password);
      
      if (response.success && response.data) {
        setIsAuthenticated(true);
        setUser(response.data.user);
        setIsLoading(false);
        return true;
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      setIsAuthenticated(false);
      setError(error instanceof Error ? error.message : 'Registration failed');
      setIsLoading(false);
      return false;
    }
  }, []);

  /**
   * Logs out the current user by clearing tokens and state.
   * 
   * @returns {Promise<boolean>} True if logout was successful
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      
      await authService.logout();
      
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      
      return true;
    } catch {
      authService.clearTokens();
      
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      
      return true;
    }
  }, []);

  /**
   * Refreshes the access token using the refresh token.
   * 
   * @returns {Promise<boolean>} True if token refresh was successful, false otherwise
   */
  const refreshToken = useCallback(async () => {
    try {
      const refreshed = await authService.refreshAccessToken();
      
      if (refreshed) {
        const currentUser = authService.getUser();
        
        setIsAuthenticated(true);
        setUser(currentUser);
        
        return true;
      }
      
      setIsAuthenticated(false);
      setUser(null);
      
      return false;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      setError(error instanceof Error ? error.message : 'Token refresh failed');
      
      return false;
    }
  }, []);

  /**
   * Returns the current access token.
   * 
   * @returns {string|null} The access token or null if not authenticated
   */
  const getAccessToken = useCallback(() => {
    return authService.getAccessToken();
  }, []);

  const contextValue: IAuthContext = {
    isAuthenticated,
    isLoading,
    user,
    error,
    login,
    register,
    logout,
    refreshToken,
    getAccessToken
  };

  return (
    <AuthContextInstance.Provider value={contextValue}>
      {children}
    </AuthContextInstance.Provider>
  );
} 