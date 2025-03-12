import { AUTH_ENDPOINTS, API_URL } from '../api/config';

// Re-export the API URL and endpoints for backward compatibility
export { API_URL, AUTH_ENDPOINTS as API_ENDPOINTS };

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user'
} as const; 