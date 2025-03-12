/**
 * API Configuration
 * 
 * This file centralizes all API configuration and ensures that
 * the API URL is properly set in the environment variables.
 */

// Function to get the API URL from environment variables
function getApiUrl(): string {
  // In browser environments, use the Next.js API proxy to avoid CORS issues
  if (typeof window !== 'undefined') {
    // Use the Next.js API proxy
    return '/api';
  }
  
  // For server-side rendering, use the environment variable
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    throw new Error(
      'NEXT_PUBLIC_API_URL environment variable is not defined. ' +
      'This is required for the application to communicate with the backend API.'
    );
  }
  
  // Remove trailing slash if present to prevent double slashes in URLs
  return apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
}

// Export the API URL
export const API_URL = getApiUrl();

// Log the API URL for debugging
console.debug('API URL configured as:', API_URL);

// Auth endpoints - don't include the full URL, just the paths
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login/',
  REGISTER: '/auth/register/',
  LOGOUT: '/auth/logout/',
  VERIFY: '/auth/verify/',
  REFRESH: '/auth/refresh/',
};

// Todo endpoints - don't include the full URL, just the paths
export const TODO_ENDPOINTS = {
  TASKS: '/tasks/',
  TASK_BY_ID: (id: string) => `/tasks/${id}/`,
  LABELS: '/labels/',
  LABEL_BY_ID: (id: string) => `/labels/${id}/`,
};

// Health check endpoint - don't include the full URL, just the path
export const HEALTH_ENDPOINT = '/health/';

// Helper function to construct full URLs
export function getFullUrl(path: string): string {
  // Ensure path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${normalizedPath}`;
}

// Export all endpoints in a single object for convenience
export const API_ENDPOINTS = {
  ...AUTH_ENDPOINTS,
  ...TODO_ENDPOINTS,
  HEALTH: HEALTH_ENDPOINT,
};

// Export a function to check API health
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(getFullUrl(HEALTH_ENDPOINT));
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
} 