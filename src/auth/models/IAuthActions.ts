export interface IAuthActions {
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  refreshToken: () => Promise<boolean>;
  getAccessToken: () => string | null;
} 