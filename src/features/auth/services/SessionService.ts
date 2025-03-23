import { ISessionService, User } from '../types';
import { httpService } from '@/common/http';

export class SessionService implements ISessionService {
  private static instance: SessionService;
  private sessionToken: string | null = null;
  private sessionExpiry: Date | null = null;
  
  private constructor() {}
  
  public static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  public async checkSession(): Promise<{ isAuthenticated: boolean; user: User | null }> {
    try {
      const response = await httpService.get<{ success: boolean }>('/auth/session');
      
      if (!response.success) {
        return { isAuthenticated: false, user: null };
      }
      
      return this.getUserInfo();
    } catch (error) {
      console.error('Session check error:', error);
      return { isAuthenticated: false, user: null };
    }
  }
  
  public async getUserInfo(): Promise<{ isAuthenticated: boolean; user: User | null }> {
    try {
      const response = await httpService.get<User>('/auth/user');
      
      if (!response.success || !response.data) {
        return { isAuthenticated: false, user: null };
      }
      
      return { 
        isAuthenticated: true, 
        user: response.data 
      };
    } catch (error) {
      console.error('Get user info error:', error);
      return { isAuthenticated: false, user: null };
    }
  }
  
  public async refreshSession(): Promise<boolean> {
    try {
      const response = await httpService.post<{ success: boolean }>('/auth/refresh');
      return response.success;
    } catch (error) {
      console.error('Session refresh error:', error);
      return false;
    }
  }
  
  public getSessionToken(): string | null {
    return this.sessionToken;
  }
  
  public clearSession(): void {
    this.sessionToken = null;
    this.sessionExpiry = null;
  }
  
  public setSessionExpiryTime(expiresInDays: number): void {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + expiresInDays);
    this.sessionExpiry = expiry;
  }
  
  public isSessionExpired(): boolean {
    if (!this.sessionExpiry) {
      return true;
    }
    
    return new Date() > this.sessionExpiry;
  }
}

export const sessionService = SessionService.getInstance(); 