import { ApiError } from './errors/ApiError';
import { ApiResponse, HttpMethod, RequestOptions } from './types';

export class HttpService {
  private static instance: HttpService;
  private readonly baseUrl: string;

  private constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public static getInstance(baseUrl: string = '/api'): HttpService {
    if (!HttpService.instance) {
      HttpService.instance = new HttpService(baseUrl);
    }
    return HttpService.instance;
  }

  public async get<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public async post<T>(endpoint: string, data?: unknown, options?: Omit<RequestOptions, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data
    });
  }

  public async put<T>(endpoint: string, data?: unknown, options?: Omit<RequestOptions, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data
    });
  }

  public async patch<T>(endpoint: string, data?: unknown, options?: Omit<RequestOptions, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data
    });
  }

  public async delete<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = this.buildUrl(endpoint);
      const requestOptions = this.createRequestOptions(options);
      
      const response = await fetch(url, requestOptions);
      return await this.processResponse<T>(response);
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  private buildUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  }

  private createRequestOptions(options: RequestOptions): RequestInit {
    const { method, headers = {}, body } = options;
    
    const requestOptions: RequestInit = {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers,
      }
    };
    
    if (body) {
      requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }
    
    return requestOptions;
  }

  private async processResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    let data: any = {};
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json().catch(() => ({}));
    }
    
    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || `Request failed with status ${response.status}`
      };
    }
    
    return {
      success: true,
      data: data.data || data
    };
  }

  private handleError<T>(error: unknown): ApiResponse<T> {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
} 