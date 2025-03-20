import { IApiRequestOptions, IApiResponse, HttpMethod } from '../types/api';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login/',
  REGISTER: '/auth/register/',
  LOGOUT: '/auth/logout/',
  VERIFY: '/auth/verify/',
  REFRESH: '/auth/refresh/',
};

// Todo endpoints
export const TODO_ENDPOINTS = {
  TASKS: '/tasks/',
  TASK_BY_ID: (id: string) => `/tasks/${id}/`,
  LABELS: '/labels/',
  LABEL_BY_ID: (id: string) => `/labels/${id}/`,
};

// Health check endpoint
export const HEALTH_ENDPOINT = '/health/';

// Export all endpoints in a single object for convenience
export const API_ENDPOINTS = {
  ...AUTH_ENDPOINTS,
  ...TODO_ENDPOINTS,
  HEALTH: HEALTH_ENDPOINT,
};

/**
 * Base API client for making HTTP requests
 * Implements the Singleton pattern to ensure a single instance is used throughout the application
 */
export class ApiClient {
  private static instance: ApiClient;
  private baseUrl: string;

  /**
   * Private constructor to prevent direct instantiation
   * Use getInstance() instead
   */
  private constructor() {
    // For client-side requests, use the Next.js API routes
    this.baseUrl = typeof window !== 'undefined' ? '/api' : process.env.NEXT_PUBLIC_API_URL || '';
    
    // Remove trailing slash if present
    this.baseUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
  }

  /**
   * Get the singleton instance of ApiClient
   */
  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  /**
   * Get the full URL for an endpoint
   */
  public getFullUrl(path: string): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.baseUrl}${normalizedPath}`;
  }

  /**
   * Check API health
   */
  public async checkHealth(): Promise<boolean> {
    try {
      const response = await this.get(HEALTH_ENDPOINT);
      return response.success;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }

  /**
   * Make an HTTP request
   * 
   * @param endpoint - API endpoint (without base URL)
   * @param method - HTTP method
   * @param options - Request options
   * @returns Promise with the response data
   */
  public async request<T = any>(
    endpoint: string,
    method: HttpMethod = 'GET',
    options: IApiRequestOptions = {}
  ): Promise<IApiResponse<T>> {
    try {
      // Ensure endpoint starts with a slash
      const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      const url = `${this.baseUrl}${normalizedEndpoint}`;
      
      // Default options
      const defaultOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: options.withCredentials ? 'include' : 'same-origin',
      };
      
      // Add body for non-GET requests
      if (method !== 'GET' && options.body) {
        defaultOptions.body = typeof options.body === 'string'
          ? options.body
          : JSON.stringify(options.body);
      }
      
      // Merge options
      const fetchOptions = {
        ...defaultOptions,
        ...options,
        headers: {
          ...defaultOptions.headers,
          ...options.headers,
        },
      };
      
      // Make the request
      const response = await fetch(url, fetchOptions);
      
      // Parse the response
      let data: any;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      // Handle error responses
      if (!response.ok && options.handleErrors !== false) {
        const error = new Error(data.message || 'An error occurred');
        (error as any).status = response.status;
        (error as any).data = data;
        throw error;
      }
      
      // Return the response
      return {
        success: response.ok,
        data: response.ok ? data : undefined,
        message: !response.ok ? data.message : undefined,
      };
    } catch (error) {
      console.error('API request failed:', error);
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  /**
   * Make a GET request
   */
  public async get<T = any>(endpoint: string, options: IApiRequestOptions = {}): Promise<IApiResponse<T>> {
    return this.request<T>(endpoint, 'GET', options);
  }

  /**
   * Make a POST request
   */
  public async post<T = any>(endpoint: string, data?: any, options: IApiRequestOptions = {}): Promise<IApiResponse<T>> {
    return this.request<T>(endpoint, 'POST', { ...options, body: data });
  }

  /**
   * Make a PUT request
   */
  public async put<T = any>(endpoint: string, data?: any, options: IApiRequestOptions = {}): Promise<IApiResponse<T>> {
    return this.request<T>(endpoint, 'PUT', { ...options, body: data });
  }

  /**
   * Make a PATCH request
   */
  public async patch<T = any>(endpoint: string, data?: any, options: IApiRequestOptions = {}): Promise<IApiResponse<T>> {
    return this.request<T>(endpoint, 'PATCH', { ...options, body: data });
  }

  /**
   * Make a DELETE request
   */
  public async delete<T = any>(endpoint: string, options: IApiRequestOptions = {}): Promise<IApiResponse<T>> {
    return this.request<T>(endpoint, 'DELETE', options);
  }
} 