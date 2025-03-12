/**
 * API Configuration
 * 
 * This file centralizes all API configuration and ensures that
 * the API URL is properly set in the environment variables.
 */

// Function to get the API URL from environment variables
function getApiUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    throw new Error(
      'NEXT_PUBLIC_API_URL environment variable is not set. ' +
      'Please set it in your .env.local file. ' +
      'This is required for the application to communicate with the backend API.'
    );
  }
  
  // Remove trailing slash if present
  return apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
}

// Export the API URL
export const API_URL = getApiUrl();

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_URL}/auth/login/`,
  REGISTER: `${API_URL}/auth/register/`,
  LOGOUT: `${API_URL}/auth/logout/`,
  VERIFY: `${API_URL}/auth/verify/`,
  REFRESH: `${API_URL}/auth/refresh/`,
};

// Todo endpoints
export const TODO_ENDPOINTS = {
  TASKS: `${API_URL}/tasks/`,
  TASK_BY_ID: (id: string) => `${API_URL}/tasks/${id}/`,
  LABELS: `${API_URL}/labels/`,
  LABEL_BY_ID: (id: string) => `${API_URL}/labels/${id}/`,
};

// Health check endpoint
export const HEALTH_ENDPOINT = `${API_URL}/health/`;

// Export all endpoints in a single object for convenience
export const API_ENDPOINTS = {
  ...AUTH_ENDPOINTS,
  ...TODO_ENDPOINTS,
  HEALTH: HEALTH_ENDPOINT,
};

// Export a function to check API health
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(HEALTH_ENDPOINT);
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
} 