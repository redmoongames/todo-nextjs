import { IUser } from './IUser';
import { IAuthTokens } from './IAuthTokens';

export interface IAuthResponse {
  success: boolean;
  data?: {
    tokens: IAuthTokens;
    user: IUser;
  };
  error?: string;
} 