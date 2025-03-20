import { ApiResponse } from '@/app/api/utils';

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthResult {
  success: boolean;
  message?: string;
  user?: User;
}

class ClientAuthService {
  private static instance: ClientAuthService;
  
  private constructor() {}
  
  public static getInstance(): ClientAuthService {
    if (!ClientAuthService.instance) {
      ClientAuthService.instance = new ClientAuthService();
    }
    return ClientAuthService.instance;
  }
  
  public async checkSession(): Promise<{ isAuthenticated: boolean; user: User | null }> {
    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'include',
      });
      
      console.log(`[ClientAuthService] Session check ${response.status}. ${response.statusText}`);
      
      if (!response.ok) {
        return { isAuthenticated: false, user: null };
      }
      
      const data = await this.parseResponseData(response);
      
      if (!data.success) {
        return { isAuthenticated: false, user: null };
      }
      
      return this.getUserInfo();
    } catch (error) {
      console.error('[ClientAuthService] Session check error:', error);
      return { isAuthenticated: false, user: null };
    }
  }
  
  private async parseResponseData(response: Response): Promise<any> {
    try {
      return await response.json();
    } catch (error) {
      console.error('[ClientAuthService] Failed to parse response data:', error);
      return { success: false };
    }
  }
  
  public async getUserInfo(): Promise<{ isAuthenticated: boolean; user: User | null }> {
    try {
      const response = await fetch('/api/auth/user', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!response.ok) {
        return { isAuthenticated: false, user: null };
      }
      
      const data: ApiResponse<User> = await this.parseResponseData(response);
      
      if (!data.success || !data.data) {
        return { isAuthenticated: false, user: null };
      }
      
      return { 
        isAuthenticated: true, 
        user: data.data 
      };
    } catch (error) {
      console.error('[ClientAuthService] Get user info error:', error);
      return { isAuthenticated: false, user: null };
    }
  }
  
  public async login(credentials: LoginCredentials): Promise<AuthResult> {
    console.log(`[ClientAuthService] Login attempt for user: ${credentials.username}`);
    
    if (!this.validateLoginCredentials(credentials)) {
      return {
        success: false,
        message: '[ClientAuthService] Fail to validate login credentials'
      };
    }
    
    try {
      const payload = this.prepareLoginPayload(credentials);
      
      console.log('[ClientAuthService] Sending login request. Payload:', payload);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      
      console.log(`[ClientAuthService] Login response: ${response.status}. ${response.statusText}`);
      
      if (!response.ok) {
        return this.handleFailedLoginResponse(response);
      }
      
      return this.handleSuccessfulLogin();
    } catch (error) {
      return this.handleLoginError(error);
    }
  }
  
  private validateLoginCredentials(credentials: LoginCredentials): boolean {
    return Boolean(credentials.username && credentials.password);
  }
  
  private prepareLoginPayload(credentials: LoginCredentials): object {
    return {
      username: credentials.username.trim(),
      password: credentials.password
    };
  }
  
  private async handleFailedLoginResponse(response: Response): Promise<AuthResult> {
    try {
      const data = await this.parseResponseData(response);
      return {
        success: false,
        message: data.message || 'Login failed. Please check your credentials.'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to process login response'
      };
    }
  }
  
  private async handleSuccessfulLogin(): Promise<AuthResult> {
    const userInfo = await this.getUserInfo();
    
    return {
      success: true,
      message: 'Login successful',
      user: userInfo.user || undefined
    };
  }
  
  private handleLoginError(error: unknown): AuthResult {
    console.error('[ClientAuthService] Login error:', error);
    return {
      success: false,
      message: 'An error occurred during login. Please try again.'
    };
  }
  
  public async register(registrationData: RegisterData): Promise<{ success: boolean; message?: string }> {
    console.log('[ClientAuthService] Registering new user:', registrationData.username);
    
    try {
      const requestData = this.prepareRegistrationData(registrationData);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData),
        credentials: 'include',
      });
      
      console.log('[ClientAuthService] Registration response status:', response.status);
      
      if (response.status === 400) {
        return this.handleRegistrationValidationError(response);
      }
      
      if (!response.ok) {
        return this.handleRegistrationFailure(response);
      }
      
      return this.handleRegistrationSuccess(response);
    } catch (error) {
      return this.handleRegistrationError(error);
    }
  }
  
  private prepareRegistrationData(data: RegisterData): object {
    return {
      username: data.username,
      email: data.email,
      password: data.password
    };
  }
  
  private async handleRegistrationValidationError(response: Response): Promise<{ success: boolean; message?: string }> {
    try {
      const data = await this.parseResponseData(response);
      return {
        success: false,
        message: data.message || data.error || 'Unable to create account with provided details'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to process registration response'
      };
    }
  }
  
  private async handleRegistrationFailure(response: Response): Promise<{ success: boolean; message?: string }> {
    try {
      const data = await this.parseResponseData(response);
      return {
        success: false,
        message: data.message || data.error || `Registration failed with status ${response.status}`
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to process registration response'
      };
    }
  }
  
  private async handleRegistrationSuccess(response: Response): Promise<{ success: boolean; message?: string }> {
    try {
      const data = await this.parseResponseData(response);
      return {
        success: data.success || true,
        message: data.message
      };
    } catch (error) {
      return {
        success: true,
        message: 'Registration successful'
      };
    }
  }
  
  private handleRegistrationError(error: unknown): { success: boolean; message?: string } {
    console.error('[ClientAuthService] Registration error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
  
  /**
   * Logout the user
   */
  public async logout(): Promise<{ success: boolean; redirect?: string }> {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      const data = await this.parseResponseData(response);
      
      return {
        success: data.success,
        redirect: data.redirect,
      };
    } catch (error) {
      console.error('[ClientAuthService] Logout error:', error);
      return { success: false };
    }
  }
}

export const clientAuthService = ClientAuthService.getInstance(); 