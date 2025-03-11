// Function to get the API URL based on the current environment
function getApiUrl(): string {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // Extract the hostname from window.location
    const { hostname } = window.location;
    
    // If we're running on localhost or 172.17.0.2, use the backend API directly
    if (hostname === 'localhost' || hostname === '172.17.0.2') {
      return process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    }
    
    // For production, use the same origin
    return `${window.location.origin}/api`;
  }
  
  // Default for server-side rendering
  return process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
}

export const API_URL = getApiUrl();

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user'
} as const;

export const API_ENDPOINTS = {
  LOGIN: '/auth/login/',
  REGISTER: '/auth/register/',
  LOGOUT: '/auth/logout/',
  VERIFY: '/auth/verify/',
  REFRESH: '/auth/refresh/'
} as const; 