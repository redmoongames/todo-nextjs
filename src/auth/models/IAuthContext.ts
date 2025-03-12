import { IUser } from './IUser';

export interface IAuthContext {
  // State
  isAuthenticated: boolean;
  isLoading: boolean;
  user: IUser | null;
  error: string | null;
  
  // Actions
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  refreshToken: () => Promise<boolean>;
  getAccessToken: () => string | null;
} 