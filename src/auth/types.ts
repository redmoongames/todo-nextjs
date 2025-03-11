export interface User {
  id: number;
  username: string;
  date_joined: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
  type: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  getAccessToken: () => string | null;
  refreshToken: () => Promise<boolean>;
} 