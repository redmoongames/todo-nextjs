import { useContext } from 'react';
import { AuthContextInstance } from '../components/AuthProvider';
import { IAuthContext } from '../models';

/**
 * Custom hook to access the authentication context.
 * 
 * This hook provides access to authentication state and methods for login, logout,
 * registration, and token management. It must be used within an AuthProvider component.
 * 
 * @returns {IAuthContext} The authentication context containing state and methods
 * @throws {Error} If used outside of an AuthProvider
 * 
 * @example
 * const { isAuthenticated, login, logout } = useAuth();
 * 
 * if (isAuthenticated) {
 *   return <button onClick={logout}>Logout</button>;
 * }
 * 
 * return <button onClick={() => login('username', 'password')}>Login</button>;
 */
export function useAuth(): IAuthContext {
  const context = useContext(AuthContextInstance);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 