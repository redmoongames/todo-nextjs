import { 
  IAuthenticationService, 
  AuthResult, 
  LoginCredentials, 
  RegisterData 
} from '../types';
import { sessionService } from './SessionService';
import { httpService } from '@/shared/http';

export class AuthenticationService implements IAuthenticationService {
  private static instance: AuthenticationService;
  
  private constructor() {}
  
  public static getInstance(): AuthenticationService {
    if (!AuthenticationService.instance) {
      AuthenticationService.instance = new AuthenticationService();
    }
    return AuthenticationService.instance;
  }

  public async login(credentials: LoginCredentials): Promise<AuthResult> {
    if (!this.validateLoginCredentials(credentials)) {
      return {
        success: false,
        message: 'Invalid login credentials'
      };
    }
    
    try {
      const payload = this.prepareLoginPayload(credentials);
      
      const response = await httpService.post<any>('/auth/login', payload);
      
      if (!response.success) {
        return {
          success: false,
          message: response.error || 'Login failed. Please check your credentials.'
        };
      }
      
      return this.handleSuccessfulLogin();
    } catch (error) {
      return this.handleLoginError(error);
    }
  }
  
  public validateLoginCredentials(credentials: LoginCredentials): boolean {
    return Boolean(credentials.username && credentials.password);
  }
  
  private prepareLoginPayload(credentials: LoginCredentials): object {
    return {
      username: credentials.username.trim(),
      password: credentials.password
    };
  }
  
  private async handleSuccessfulLogin(): Promise<AuthResult> {
    const userInfo = await sessionService.getUserInfo();
    
    return {
      success: true,
      message: 'Login successful',
      user: userInfo.user || undefined
    };
  }
  
  private handleLoginError(error: unknown): AuthResult {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'An error occurred during login. Please try again.'
    };
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
      const requestData = this.prepareRegistrationData(data);
      
      const response = await httpService.post<any>('/auth/register', requestData);
      
      if (!response.success) {
        return {
          success: false,
          message: response.error || 'Registration failed'
        };
      }
      
      return {
        success: true,
        message: 'Registration successful'
      };
    } catch (error) {
      return this.handleRegistrationError(error);
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
  
  private prepareRegistrationData(data: RegisterData): object {
    return {
      username: data.username,
      email: data.email,
      password: data.password
    };
  }
  
  private handleRegistrationError(error: unknown): AuthResult {
    console.error('Registration error:', error);
    return {
      success: false,
      message: 'An error occurred during registration. Please try again.'
    };
  }
  
  public async logout(): Promise<{ success: boolean; redirect?: string }> {
    try {
      const response = await httpService.post<{ redirect?: string }>('/auth/logout');
      
      if (!response.success) {
        return { success: false };
      }
      
      sessionService.clearSession();
      
      return { 
        success: true, 
        redirect: response.data?.redirect || '/login'
      };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false };
    }
  }
}

export const authenticationService = AuthenticationService.getInstance(); 