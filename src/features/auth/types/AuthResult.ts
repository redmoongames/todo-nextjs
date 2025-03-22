import { User } from './User';

export interface AuthResult {
  success: boolean;
  message?: string;
  user?: User;
  redirect?: string;
} 