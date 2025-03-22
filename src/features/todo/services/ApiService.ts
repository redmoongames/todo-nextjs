// Define the interfaces locally instead of importing from a non-existent module
export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

export interface IApiRequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
}

export class ApiService {
  private static instance: ApiService;
  private readonly API_URL: string;

  private constructor() {
    this.API_URL = '/api/v1';
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: IApiRequestOptions = {}
  ): Promise<IApiResponse<T>> {
    try {
      const url = `${this.API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      
      const response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });
      
      const data = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        return { 
          success: false, 
          message: data.message || data.error || `Request failed: ${response.statusText}` 
        };
      }
      
      return { 
        success: true, 
        data: data.data || data 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  public async get<T>(endpoint: string): Promise<IApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET' });
  }

  public async post<T>(endpoint: string, data?: any): Promise<IApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public async put<T>(endpoint: string, data?: any): Promise<IApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public async delete<T>(endpoint: string): Promise<IApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiService = ApiService.getInstance(); 