import { getFullUrl } from '../../api/config';

/**
 * Standard API response format
 * @template T The type of data returned by the API
 */
export interface IApiResponse<T> {
  /** Whether the request was successful */
  success: boolean;
  /** The data returned by the API (if successful) */
  data?: T;
  /** Error message (if unsuccessful) */
  error?: string;
}

/**
 * Service responsible for making API requests.
 * 
 * This service:
 * - Handles API communication
 * - Standardizes request and response formats
 * - Manages authentication headers
 * - Provides error handling
 * 
 * Implements the Singleton pattern to ensure a single instance is used throughout the application.
 */
export class ApiService {
  private static instance: ApiService;

  /**
   * Private constructor to prevent direct instantiation.
   * Use getInstance() instead.
   */
  private constructor() {}

  /**
   * Gets the singleton instance of ApiService.
   * 
   * @returns {ApiService} The singleton instance
   */
  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  /**
   * Makes an API request with standardized error handling.
   * 
   * @template T The expected response data type
   * @param {string} endpoint - The API endpoint to call
   * @param {RequestInit} options - Fetch options for the request
   * @param {string|null} token - Optional authentication token
   * @returns {Promise<IApiResponse<T>>} Standardized API response
   * 
   * @example
   * // Basic GET request
   * const response = await apiService.fetch<User[]>('/users');
   * 
   * // POST request with authentication
   * const response = await apiService.fetch<User>(
   *   '/users',
   *   {
   *     method: 'POST',
   *     body: JSON.stringify({ name: 'John' })
   *   },
   *   accessToken
   * );
   */
  public async fetch<T>(endpoint: string, options: RequestInit = {}, token?: string | null): Promise<IApiResponse<T>> {
    try {
      const fullUrl = getFullUrl(endpoint);
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options.headers as Record<string, string> || {})
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(fullUrl, {
        ...options,
        headers,
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        return { 
          success: false, 
          error: error.message 
        };
      }
      
      return { 
        success: false, 
        error: 'Unknown error occurred' 
      };
    }
  }
} 