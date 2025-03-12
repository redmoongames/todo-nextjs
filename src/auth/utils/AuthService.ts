import { IUser } from '../models/IUser';
import { IAuthResponse } from '../models/IAuthResponse';
import { API_ENDPOINTS } from '../constants';
import { TokenService, TokenData } from './TokenService';
import { ApiService } from './ApiService';

/**
 * Result of an authentication operation
 */
export interface AuthResult {
  /** Whether the operation was successful */
  success: boolean;
  /** The authenticated user (if successful) */
  user?: IUser;
  /** Error message (if unsuccessful) */
  error?: string;
}

/**
 * Service responsible for authentication operations.
 * 
 * This service:
 * - Manages user authentication (login, register, logout)
 * - Handles token verification and refresh
 * - Delegates token storage to TokenService
 * - Uses ApiService for API communication
 * 
 * Implements the Singleton pattern to ensure a single instance is used throughout the application.
 */
export class AuthService {
  private static instance: AuthService;
  private tokenService: TokenService;
  private apiService: ApiService;

  /**
   * Private constructor to prevent direct instantiation.
   * Use getInstance() instead.
   */
  private constructor() {
    this.tokenService = TokenService.getInstance();
    this.apiService = ApiService.getInstance();
  }

  /**
   * Gets the singleton instance of AuthService.
   * 
   * @returns {AuthService} The singleton instance
   */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Gets the current access token.
   * 
   * @returns {string|null} The access token or null if not authenticated
   */
  public getAccessToken(): string | null {
    return this.tokenService.getAccessToken();
  }

  /**
   * Gets the current authenticated user.
   * 
   * @returns {IUser|null} The user object or null if not authenticated
   */
  public getUser(): IUser | null {
    return this.tokenService.getUser();
  }

  /**
   * Checks if the user is authenticated.
   * 
   * @returns {boolean} True if authenticated, false otherwise
   */
  public isAuthenticated(): boolean {
    return this.tokenService.isAuthenticated();
  }

  /**
   * Checks if the access token needs to be refreshed.
   * 
   * @returns {boolean} True if token needs refresh, false otherwise
   */
  public needsTokenRefresh(): boolean {
    return this.tokenService.needsRefresh();
  }

  /**
   * Clears tokens if they are expiring.
   * Useful when on login/register pages to ensure a clean authentication state.
   */
  public clearTokensIfExpiring(): void {
    this.tokenService.clearIfExpiring();
  }

  /**
   * Clears all authentication tokens and user data.
   */
  public clearTokens(): void {
    this.tokenService.clear();
  }

  /**
   * Authenticates a user with username and password.
   * 
   * @param {string} username - The user's username
   * @param {string} password - The user's password
   * @returns {Promise<IAuthResponse>} The authentication response
   */
  public async login(username: string, password: string): Promise<IAuthResponse> {
    this.clearTokens();
    
    const response = await this.apiService.fetch<{
      tokens: TokenData;
      user: IUser;
    }>(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    if (response.success && response.data) {
      this.tokenService.store(response.data.tokens, response.data.user);
    }
    
    return response;
  }

  /**
   * Registers a new user with username and password.
   * 
   * @param {string} username - The desired username
   * @param {string} password - The desired password
   * @returns {Promise<IAuthResponse>} The registration response
   */
  public async register(username: string, password: string): Promise<IAuthResponse> {
    this.clearTokens();
    
    const response = await this.apiService.fetch<{
      tokens: TokenData;
      user: IUser;
    }>(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    if (response.success && response.data) {
      this.tokenService.store(response.data.tokens, response.data.user);
    }
    
    return response;
  }

  /**
   * Logs out the current user by clearing tokens and notifying the server.
   */
  public async logout(): Promise<void> {
    const token = this.getAccessToken();
    
    if (token) {
      try {
        await this.apiService.fetch(API_ENDPOINTS.LOGOUT, {
          method: 'POST',
        }, token);
      } catch {
        // Even if the API call fails, we still want to clear tokens
      }
    }
    
    this.clearTokens();
  }

  /**
   * Verifies the current access token with the server.
   * 
   * @returns {Promise<boolean>} True if token is valid, false otherwise
   */
  public async verifyToken(): Promise<boolean> {
    const token = this.getAccessToken();
    
    if (!token) {
      return false;
    }
    
    try {
      const response = await this.apiService.fetch(API_ENDPOINTS.VERIFY, {
        method: 'GET',
      }, token);
      
      return response.success;
    } catch {
      this.clearTokens();
      return false;
    }
  }

  /**
   * Refreshes the access token using the refresh token.
   * 
   * @returns {Promise<boolean>} True if token refresh was successful, false otherwise
   */
  public async refreshAccessToken(): Promise<boolean> {
    const refreshToken = this.tokenService.getRefreshToken();
    
    if (!refreshToken) {
      return false;
    }
    
    try {
      const response = await this.apiService.fetch<{
        tokens: TokenData;
        user: IUser;
      }>(API_ENDPOINTS.REFRESH, {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      
      if (response.success && response.data) {
        this.tokenService.store(response.data.tokens, response.data.user);
        return true;
      }
      
      return false;
    } catch {
      this.clearTokens();
      return false;
    }
  }
} 