import { IUserService, User } from '../types';
import { httpService } from '@/shared/http';
import { sessionService } from './SessionService';

export class UserService implements IUserService {
  private static instance: UserService;
  
  private constructor() {}
  
  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  public async getCurrentUser(): Promise<User | null> {
    const response = await httpService.get<User>('/auth/user');
    
    if (!response.success || !response.data) {
      return null;
    }
    
    return response.data;
  }
  
  public async getUserById(userId: string): Promise<User | null> {
    const response = await httpService.get<User>(`/auth/users/${userId}`);
    
    if (!response.success || !response.data) {
      return null;
    }
    
    return response.data;
  }
  
  public async updateUserProfile(userId: string, profileData: Partial<User>): Promise<boolean> {
    const response = await httpService.put<User>(`/auth/users/${userId}`, profileData);
    
    return response.success;
  }
  
  public async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
    const passwordData = {
      oldPassword,
      newPassword
    };
    
    const response = await httpService.post<{ success: boolean }>(`/auth/users/${userId}/change-password`, passwordData);
    
    return response.success;
  }
  
  public async deleteAccount(userId: string, password: string): Promise<boolean> {
    const data = {
      password,
      confirmation: true
    };
    
    const response = await httpService.delete<{ success: boolean }>(`/auth/users/${userId}`, {
      headers: {
        'X-Confirm-Delete': 'true'
      }
    });
    
    if (response.success) {
      sessionService.clearSession();
    }
    
    return response.success;
  }

  public async updateProfile(userData: Partial<User>): Promise<User | null> {
    const response = await httpService.put<User>('/auth/user', userData);
    
    if (!response.success || !response.data) {
      return null;
    }
    
    return response.data;
  }
}

export const userService = UserService.getInstance(); 