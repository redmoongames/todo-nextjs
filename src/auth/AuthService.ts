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
    console.debug("[DEBUG] Initializing AuthService with API URL:", this.API_URL);
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
      console.debug("[DEBUG] Loading tokens from storage");
      
      this.accessToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
      this.refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
      
      const expiryStr = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
      this.tokenExpiryTime = expiryStr ? parseInt(expiryStr, 10) : null;
      
      const userStr = localStorage.getItem(this.USER_KEY);
      this.user = userStr ? JSON.parse(userStr) : null;
      
      console.debug("[DEBUG] Tokens loaded", { 
        hasAccessToken: !!this.accessToken,
        hasRefreshToken: !!this.refreshToken,
        hasUser: !!this.user,
        tokenExpiry: this.tokenExpiryTime ? new Date(this.tokenExpiryTime).toISOString() : null
      });
    } catch (error) {
      console.error('Error loading tokens from storage:', error);
      this.clearTokens();
    }
  }

  private saveTokensToStorage(tokens: { access: string; refresh: string; type: string }, user: User): void {
    if (typeof window === 'undefined') return;
    
    try {
      console.debug("[DEBUG] Saving tokens to storage", { 
        accessTokenLength: tokens.access.length,
        refreshTokenLength: tokens.refresh.length,
        user: user.username 
      });
      
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
      
      console.debug("[DEBUG] Tokens saved successfully");
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

  // Helper method to decode JWT token for debugging
  private decodeJWT(token: string): Record<string, unknown> {
    try {
      // Split the token into parts
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('[DEBUG] Invalid JWT format');
        return {};
      }
      
      // Decode the payload (middle part)
      const payload = parts[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('[DEBUG] Error decoding JWT:', error);
      return {};
    }
  }

  // API methods
  private async fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<AuthResponse> {
    try {
      console.debug(`[DEBUG] Fetching ${endpoint}`, { 
        method: options.method || 'GET',
        hasAuthHeader: !!(options.headers && 'Authorization' in options.headers)
      });
      
      // Log the full authorization header for debugging (only in development)
      if (options.headers && 'Authorization' in options.headers) {
        const authHeader = options.headers['Authorization'] as string;
        console.debug(`[DEBUG] Authorization header: ${authHeader.substring(0, 15)}...`);
      }
      
      const response = await fetch(`${this.API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
        credentials: 'include',
      });

      console.debug(`[DEBUG] Response status: ${response.status} ${response.statusText}`);
      
      // Log response headers for debugging
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      console.debug('[DEBUG] Response headers:', headers);
      
      const data = await response.json();
      console.debug('[DEBUG] Response data:', data);
      
      if (!response.ok) {
        console.error(`[DEBUG] API error (${response.status}):`, data.error || 'Unknown error');
        throw new Error(data.error || 'Authentication failed');
      }

      return data;
    } catch (error) {
      console.error(`[DEBUG] Fetch error for ${endpoint}:`, error);
      throw error;
    }
  }

  public async login(username: string, password: string): Promise<AuthResponse> {
    try {
      // Clear any existing tokens before login
      this.clearTokens();
      
      const response = await this.fetchWithAuth(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      
      if (response.success && response.data) {
        console.debug("[DEBUG] Login successful, saving tokens");
        this.saveTokensToStorage(response.data.tokens, response.data.user);
        
        // Verify the token format
        const decodedToken = this.decodeJWT(response.data.tokens.access);
        console.debug("[DEBUG] Saved token payload:", decodedToken);
        
        // Verify that the token contains a user_id
        if (!decodedToken || !decodedToken.user_id) {
          console.error("[DEBUG] Token missing user_id field!");
        }
      }
      
      return response;
    } catch (error) {
      console.error("[DEBUG] Login error:", error);
      throw error;
    }
  }

  public async register(username: string, password: string): Promise<AuthResponse> {
    try {
      // Clear any existing tokens before registration
      this.clearTokens();
      
      const response = await this.fetchWithAuth(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      
      if (response.success && response.data) {
        console.debug("[DEBUG] Registration successful, saving tokens");
        this.saveTokensToStorage(response.data.tokens, response.data.user);
        
        // Verify the token format
        const decodedToken = this.decodeJWT(response.data.tokens.access);
        console.debug("[DEBUG] Saved token payload:", decodedToken);
        
        // Verify that the token contains a user_id
        if (!decodedToken || !decodedToken.user_id) {
          console.error("[DEBUG] Token missing user_id field!");
        }
      }
      
      return response;
    } catch (error) {
      console.error("[DEBUG] Registration error:", error);
      throw error;
    }
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
    if (!this.accessToken) {
      console.debug("[DEBUG] No access token available for verification");
      return false;
    }
    
    // Debug: Decode and log token contents
    const decodedToken = this.decodeJWT(this.accessToken);
    console.debug("[DEBUG] Token payload:", decodedToken);
    
    try {
      console.debug("[DEBUG] Verifying token");
      
      // Ensure the token is properly formatted
      const token = this.accessToken.trim();
      
      const response = await this.fetchWithAuth(API_ENDPOINTS.VERIFY, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.debug("[DEBUG] Token verification successful");
      return response.success;
    } catch (error) {
      console.error('[DEBUG] Token verification failed:', error);
      
      // If token verification fails, clear tokens to force re-login
      if (error instanceof Error && error.message.includes('Invalid token')) {
        console.debug("[DEBUG] Clearing invalid tokens");
        this.clearTokens();
      }
      
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

  // Method to get the current API URL (useful for debugging)
  public getApiUrl(): string {
    return this.API_URL;
  }
} 