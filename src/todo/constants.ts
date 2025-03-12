import { TODO_ENDPOINTS, API_URL } from '../api/config';

// Re-export the API URL and endpoints for backward compatibility
export { API_URL, TODO_ENDPOINTS as API_ENDPOINTS };

export const PRIORITY_OPTIONS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
} as const;

export const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=You&background=1E1E1E&color=fff'; 