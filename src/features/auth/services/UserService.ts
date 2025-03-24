import { IUserService, User } from '../types';
import { sessionService } from './SessionService';

export class UserService implements IUserService {
  private static instance: UserService;
  private readonly baseUrl = '/api/auth';
  
  private constructor() {}
  
  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  public async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch(`${this.baseUrl}/user`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (!response.ok || !data) {
        return null;
      }
      
      return data;
    } catch {
      return null;
    }
  }
  
  public async getUserById(userId: string): Promise<User | null> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (!response.ok || !data) {
        return null;
      }
      
      return data;
    } catch {
      return null;
    }
  }
  
  public async updateUserProfile(userId: string, profileData: Partial<User>): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      
      return response.ok;
    } catch {
      return false;
    }
  }
  
  public async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
    try {
      const passwordData = {
        oldPassword,
        newPassword
      };
      
      const response = await fetch(`${this.baseUrl}/users/${userId}/change-password`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordData)
      });
      
      return response.ok;
    } catch {
      return false;
    }
  }
  
  public async deleteAccount(userId: string, password: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}?password=${encodeURIComponent(password)}&confirmation=true`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        sessionService.clearSession();
      }
      
      return response.ok;
    } catch {
      return false;
    }
  }

  public async updateProfile(userData: Partial<User>): Promise<User | null> {
    try {
      const response = await fetch(`${this.baseUrl}/user`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (!response.ok || !data) {
        return null;
      }
      
      return data;
    } catch {
      return null;
    }
  }
}

export const userService = UserService.getInstance(); 