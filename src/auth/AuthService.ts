import { User } from './types';
import { API_URL, API_ENDPOINTS } from './constants';

export interface AuthResponse {
  success: boolean;
  data?: {
    tokens: {
      access: string;
      refresh: string;
      type: string;
    };
    user: User;
  };
  error?: string;
}

export class AuthService {
  private static instance: AuthService;
  private readonly API_URL: string;
  private user: User | null = null;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiryTime: number | null = null;
  
  // Token storage keys
  private readonly ACCESS_TOKEN_KEY = 'auth_access_token';
  private readonly REFRESH_TOKEN_KEY = 'auth_refresh_token';
  private readonly TOKEN_EXPIRY_KEY = 'auth_token_expiry';
  private readonly USER_KEY = 'auth_user';

  private constructor() {
    this.API_URL = API_URL;
    this.loadTokensFromStorage();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Token management methods
  private loadTokensFromStorage(): void {
    if (typeof window === 'undefined') return;
    
    try {
      this.accessToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
      this.refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
      
      const expiryStr = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
      this.tokenExpiryTime = expiryStr ? parseInt(expiryStr, 10) : null;
      
      const userStr = localStorage.getItem(this.USER_KEY);
      this.user = userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error loading tokens from storage:', error);
      this.clearTokens();
    }
  }

  private saveTokensToStorage(tokens: { access: string; refresh: string; type: string }, user: User): void {
    if (typeof window === 'undefined') return;
    
    try {
      this.accessToken = tokens.access;
      this.refreshToken = tokens.refresh;
      this.user = user;
      
      // Set token expiry to 15 minutes from now (typical JWT expiry)
      const expiryTime = Date.now() + 15 * 60 * 1000;
      this.tokenExpiryTime = expiryTime;
      
      localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.access);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refresh);
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving tokens to storage:', error);
    }
  }

  public clearTokens(): void {
    if (typeof window === 'undefined') return;
    
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiryTime = null;
    this.user = null;
    
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  public clearStaleTokensOnLoginPage(): void {
    if (this.isTokenExpired()) {
      this.clearTokens();
    }
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public getRefreshToken(): string | null {
    return this.refreshToken;
  }

  public getUser(): User | null {
    return this.user;
  }

  public isAuthenticated(): boolean {
    return !!this.accessToken && !this.isTokenExpired();
  }

  public isTokenExpired(): boolean {
    if (!this.tokenExpiryTime) return true;
    return Date.now() > this.tokenExpiryTime;
  }

  public needsTokenRefresh(): boolean {
    if (!this.tokenExpiryTime) return false;
    // Refresh if less than 2 minutes remaining
    const refreshThreshold = 2 * 60 * 1000;
    return Date.now() > (this.tokenExpiryTime - refreshThreshold);
  }

  // API methods
  private async fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<AuthResponse> {
    const response = await fetch(`${this.API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Authentication failed');
    }

    return data;
  }

  public async login(username: string, password: string): Promise<AuthResponse> {
    const response = await this.fetchWithAuth(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    if (response.success && response.data) {
      this.saveTokensToStorage(response.data.tokens, response.data.user);
    }
    
    return response;
  }

  public async register(username: string, password: string): Promise<AuthResponse> {
    const response = await this.fetchWithAuth(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    if (response.success && response.data) {
      this.saveTokensToStorage(response.data.tokens, response.data.user);
    }
    
    return response;
  }

  public async logout(): Promise<void> {
    if (!this.accessToken) return;
    
    try {
      await this.fetchWithAuth(API_ENDPOINTS.LOGOUT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      this.clearTokens();
    }
  }

  public async verifyToken(): Promise<boolean> {
    if (!this.accessToken) return false;
    
    try {
      const response = await this.fetchWithAuth(API_ENDPOINTS.VERIFY, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });
      
      return response.success;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  }

  public async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;
    
    try {
      const response = await this.fetchWithAuth(API_ENDPOINTS.REFRESH, {
        method: 'POST',
        body: JSON.stringify({ refresh_token: this.refreshToken }),
      });
      
      if (response.success && response.data) {
        this.saveTokensToStorage(response.data.tokens, response.data.user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
      return false;
    }
  }
} 