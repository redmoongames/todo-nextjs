import { ISessionService, User } from '../types';

export class SessionService implements ISessionService {
  private static instance: SessionService;
  private sessionToken: string | null = null;
  private sessionExpiry: Date | null = null;
  private readonly baseUrl = '/api/auth';
  
  private constructor() {}
  
  public static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  public async checkSession(): Promise<{ isAuthenticated: boolean; user: User | null }> {
    try {
      const response = await fetch(`${this.baseUrl}/session`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        return { isAuthenticated: false, user: null };
      }
      
      return this.getUserInfo();
    } catch {
      return { isAuthenticated: false, user: null };
    }
  }
  
  private async getUserInfo(): Promise<{ isAuthenticated: boolean; user: User | null }> {
    try {
      const response = await fetch(`${this.baseUrl}/user`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (!response.ok || !data) {
        return { isAuthenticated: false, user: null };
      }
      
      return { 
        isAuthenticated: true, 
        user: data 
      };
    } catch {
      return { isAuthenticated: false, user: null };
    }
  }
  
  public async refreshSession(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      
      return response.ok;
    } catch {
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