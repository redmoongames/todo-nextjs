import { User, AuthResult, LoginCredentials, RegisterData } from './index';

export interface IAuthenticationService {
  login(credentials: LoginCredentials): Promise<AuthResult>;
  register(data: RegisterData): Promise<AuthResult>;
  logout(): Promise<{ success: boolean; redirect?: string }>;
  validateLoginCredentials(credentials: LoginCredentials): boolean;
  validateRegistrationData(data: RegisterData): { isValid: boolean; message?: string };
}

export interface IUserService {
  getCurrentUser(): Promise<User | null>;
  getUserById(userId: string): Promise<User | null>;
  updateUserProfile(userId: string, profileData: Partial<User>): Promise<boolean>;
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean>;
  deleteAccount(userId: string, password: string): Promise<boolean>;
}

export interface ISessionService {
  checkSession(): Promise<{ isAuthenticated: boolean; user: User | null }>;
  refreshSession(): Promise<boolean>;
  getSessionToken(): string | null;
  clearSession(): void;
  setSessionExpiryTime(expiresInDays: number): void;
  isSessionExpired(): boolean;
} 