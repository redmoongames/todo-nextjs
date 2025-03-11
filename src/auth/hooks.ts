import { useCallback } from 'react';
import { useAuth } from './components/AuthProvider';

/**
 * Hook to access the AuthService instance
 */
export function useAuthService() {
  const { authService } = useAuth();
  
  // Wrap methods in useCallback to maintain reference stability
  const login = useCallback(
    (username: string, password: string) => authService.login(username, password),
    [authService]
  );
  
  const register = useCallback(
    (username: string, password: string) => authService.register(username, password),
    [authService]
  );
  
  const logout = useCallback(
    () => authService.logout(),
    [authService]
  );
  
  const getAccessToken = useCallback(
    () => authService.getAccessToken(),
    [authService]
  );
  
  const getUser = useCallback(
    () => authService.getUser(),
    [authService]
  );
  
  const isAuthenticated = useCallback(
    () => authService.isAuthenticated(),
    [authService]
  );
  
  const refreshToken = useCallback(
    () => authService.refreshAccessToken(),
    [authService]
  );
  
  const verifyToken = useCallback(
    () => authService.verifyToken(),
    [authService]
  );
  
  return {
    login,
    register,
    logout,
    getAccessToken,
    getUser,
    isAuthenticated,
    refreshToken,
    verifyToken
  };
} 