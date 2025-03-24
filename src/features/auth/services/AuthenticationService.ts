import { 
  IAuthenticationService, 
  AuthResult, 
  LoginCredentials, 
  RegisterData,
  User
} from '../types';

interface LoginResponse {
  user: User;
  tokens: {
    access_token: string;
    refresh_token: string;
  };
}

export class AuthenticationService implements IAuthenticationService {
  private async fetch<T>(endpoint: string, init?: RequestInit): Promise<T> {
    const response = await fetch(endpoint, {
      ...init,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  }

  public async login(credentials: LoginCredentials): Promise<AuthResult> {
    if (!this.validateLoginCredentials(credentials)) {
      return {
        success: false,
        message: 'Invalid login credentials'
      };
    }
    
    try {
      const data = await this.fetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          username: credentials.username.trim(),
          password: credentials.password
        })
      });
      
      return {
        success: true,
        message: 'Login successful',
        user: data.user
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred during login'
      };
    }
  }
  
  public validateLoginCredentials(credentials: LoginCredentials): boolean {
    return Boolean(credentials.username && credentials.password);
  }
  
  public async register(data: RegisterData): Promise<AuthResult> {
    const validation = this.validateRegistrationData(data);
    
    if (!validation.isValid) {
      return {
        success: false,
        message: validation.message
      };
    }
    
    try {
      await this.fetch<LoginResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password
        })
      });
      
      return {
        success: true,
        message: 'Registration successful'
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred during registration'
      };
    }
  }
  
  public validateRegistrationData(data: RegisterData): { isValid: boolean; message?: string } {
    if (!data.username || !data.email || !data.password || !data.confirmPassword) {
      return { isValid: false, message: 'All fields are required' };
    }
    
    if (data.password !== data.confirmPassword) {
      return { isValid: false, message: 'Passwords do not match' };
    }
    
    if (data.password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { isValid: false, message: 'Please enter a valid email address' };
    }
    
    return { isValid: true };
  }
  
  public async logout(): Promise<{ success: boolean; redirect?: string }> {
    try {
      const data = await this.fetch<{ redirect?: string }>('/api/auth/logout', {
        method: 'POST'
      });
      
      return { 
        success: true, 
        redirect: data.redirect || '/login'
      };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false };
    }
  }
}

export const authenticationService = new AuthenticationService(); 