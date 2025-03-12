import { IUser } from '../models/IUser';
import { CookieService } from './CookieService';

/**
 * Token data structure for authentication tokens
 */
export interface TokenData {
  /** Access token for API requests */
  access: string;
  /** Refresh token for obtaining new access tokens */
  refresh: string;
  /** Token type (e.g., "Bearer") */
  type: string;
}

/**
 * Structure for tokens stored in cookies
 */
export interface StoredTokens {
  /** Access token for API requests */
  access_token: string;
  /** Refresh token for obtaining new access tokens */
  refresh_token: string;
  /** Expiry timestamp in milliseconds */
  expiry: number;
}

/**
 * Service responsible for token management.
 * 
 * This service:
 * - Stores and retrieves authentication tokens
 * - Manages token expiration
 * - Handles token storage in cookies
 * - Provides methods to check token validity
 * 
 * Implements the Singleton pattern to ensure a single instance is used throughout the application.
 */
export class TokenService {
  private static instance: TokenService;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiryTime: number | null = null;
  private user: IUser | null = null;
  
  private readonly AUTH_COOKIE_NAME = 'auth_tokens';
  private readonly USER_COOKIE_NAME = 'auth_user';
  private readonly TOKEN_EXPIRY_MINUTES = 15;
  private readonly REFRESH_THRESHOLD_MS = 60 * 1000; // 1 minute

  /**
   * Private constructor to prevent direct instantiation.
   * Use getInstance() instead.
   */
  private constructor() {
    this.loadFromStorage();
  }

  /**
   * Gets the singleton instance of TokenService.
   * 
   * @returns {TokenService} The singleton instance
   */
  public static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  /**
   * Gets the current access token.
   * 
   * @returns {string|null} The access token or null if not available
   */
  public getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Gets the current authenticated user.
   * 
   * @returns {IUser|null} The user object or null if not available
   */
  public getUser(): IUser | null {
    return this.user;
  }

  /**
   * Checks if the user is authenticated with a valid token.
   * 
   * @returns {boolean} True if authenticated with a valid token, false otherwise
   */
  public isAuthenticated(): boolean {
    return !!this.accessToken && !this.isExpired();
  }

  /**
   * Checks if the current token is expired.
   * 
   * @returns {boolean} True if token is expired or not available, false otherwise
   */
  public isExpired(): boolean {
    if (!this.tokenExpiryTime) return true;
    return Date.now() > this.tokenExpiryTime;
  }

  /**
   * Checks if the token needs to be refreshed soon.
   * 
   * @returns {boolean} True if token needs refresh, false otherwise
   */
  public needsRefresh(): boolean {
    if (!this.tokenExpiryTime) return true;
    const timeRemaining = this.tokenExpiryTime - Date.now();
    return timeRemaining < this.REFRESH_THRESHOLD_MS;
  }

  /**
   * Clears tokens if they are expiring.
   * Useful when on login/register pages to ensure a clean authentication state.
   */
  public clearIfExpiring(): void {
    if (this.accessToken && this.needsRefresh()) {
      this.clear();
    }
  }

  /**
   * Stores authentication tokens and user data.
   * 
   * @param {TokenData} tokens - The authentication tokens
   * @param {IUser} user - The authenticated user
   */
  public store(tokens: TokenData, user: IUser): void {
    if (typeof window === 'undefined') return;
    
    this.accessToken = tokens.access;
    this.refreshToken = tokens.refresh;
    this.user = user;
    
    const expiryTime = Date.now() + this.TOKEN_EXPIRY_MINUTES * 60 * 1000;
    this.tokenExpiryTime = expiryTime;
    
    const authTokens: StoredTokens = {
      access_token: tokens.access,
      refresh_token: tokens.refresh,
      expiry: expiryTime
    };
    
    CookieService.setJSON(this.AUTH_COOKIE_NAME, authTokens, {
      path: '/',
      expires: 7, // 7 days
      sameSite: 'strict',
      secure: window.location.protocol === 'https:'
    });
    
    CookieService.setJSON(this.USER_COOKIE_NAME, user, {
      path: '/',
      expires: 7, // 7 days
      sameSite: 'strict',
      secure: window.location.protocol === 'https:'
    });
  }

  /**
   * Clears all authentication tokens and user data.
   */
  public clear(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiryTime = null;
    this.user = null;
    
    if (typeof window === 'undefined') return;
    
    CookieService.remove(this.AUTH_COOKIE_NAME);
    CookieService.remove(this.USER_COOKIE_NAME);
  }

  /**
   * Gets the current refresh token.
   * 
   * @returns {string|null} The refresh token or null if not available
   */
  public getRefreshToken(): string | null {
    return this.refreshToken;
  }

  /**
   * Decodes a JWT token for debugging and inspection.
   * 
   * @param {string} token - The JWT token to decode
   * @returns {Record<string, unknown>} The decoded token payload
   */
  public decodeToken(token: string): Record<string, unknown> {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return {};
      
      const payload = parts[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      return JSON.parse(jsonPayload);
    } catch {
      return {};
    }
  }

  /**
   * Loads tokens and user data from storage (cookies).
   * Called during initialization.
   */
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    
    const authTokens = CookieService.getJSON<StoredTokens>(this.AUTH_COOKIE_NAME);
    
    if (!authTokens) return;
    
    this.accessToken = authTokens.access_token || null;
    this.refreshToken = authTokens.refresh_token || null;
    this.tokenExpiryTime = authTokens.expiry || null;
    
    this.user = CookieService.getJSON<IUser>(this.USER_COOKIE_NAME);
  }
} 