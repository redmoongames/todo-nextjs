import { ApiResponse, RequestOptions } from './types';

interface ApiErrorResponse {
  status: number;
  message: string;
  errors: Record<string, unknown>;
}

class ApiError extends Error {
  constructor(public response: ApiErrorResponse) {
    super(response.message);
    this.name = 'ApiError';
  }
}

export class HttpService {
  private static instance: HttpService;
  private readonly baseUrl: string;

  private constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public static getInstance(baseUrl: string = ''): HttpService {
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
    console.log('[HTTP SERVICE] deleting', endpoint);
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const requestId = Math.random().toString(36).substring(7);
    console.group(`[API Request ${requestId}]`);
    try {
      const url = this.buildUrl(endpoint);
      console.log('Request URL:', url);
      console.log('Base URL:', this.baseUrl);
      console.log('Endpoint:', endpoint);
      console.log('Environment:', process.env.NODE_ENV);
      
      const requestOptions = this.createRequestOptions(options);
      console.log('Request Options:', {
        method: requestOptions.method,
        headers: requestOptions.headers,
        credentials: requestOptions.credentials,
        body: requestOptions.body ? JSON.parse(requestOptions.body as string) : undefined
      });
      
      console.log('Attempting fetch...');
      const response = await fetch(url, requestOptions);
      console.log('Response received:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        ok: response.ok
      });
      
      const result = await this.processResponse<T>(response);
      console.log('Processed response:', result);
      console.groupEnd();
      return result;
    } catch (error: unknown) {
      console.error('Request failed:', error);
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      console.groupEnd();
      return this.handleError<T>(error);
    }
  }

  private buildUrl(endpoint: string): string {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('[URL Builder]', {
      baseUrl: this.baseUrl,
      endpoint,
      finalUrl: url
    });
    return url;
  }

  private createRequestOptions(options: RequestOptions): RequestInit {
    const defaultOptions: RequestInit = {
      method: options.method,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      credentials: 'include',
      body: options.body ? JSON.stringify(options.body) : undefined
    };

    console.log('[Request Options Builder]', {
      defaultOptions,
      customOptions: options,
      finalOptions: defaultOptions
    });

    return defaultOptions;
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    console.log('[Auth Headers]', {
      hasToken: !!token,
      tokenLength: token?.length
    });
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async processResponse<T>(response: Response): Promise<ApiResponse<T>> {
    console.log('[Response Processor]', {
      status: response.status,
      contentType: response.headers.get('content-type'),
      hasBody: response.body !== null
    });

    if (!response.ok) {
      const errorData = await this.parseErrorResponse(response);
      console.error('[Response Error]', errorData);
      throw new ApiError(errorData);
    }

    const data = await response.json();
    console.log('[Response Data]', data);
    return data;
  }

  private async parseErrorResponse(response: Response): Promise<ApiErrorResponse> {
    console.log('[Error Response Parser]', {
      status: response.status,
      statusText: response.statusText
    });

    try {
      const contentType = response.headers.get('content-type');
      console.log('[Error Content Type]', contentType);

      if (contentType?.includes('application/json')) {
        const data = await response.json();
        console.log('[Error JSON Data]', data);
        return {
          status: response.status,
          message: data.message || response.statusText,
          errors: data.errors || {}
        };
      }

      const text = await response.text();
      console.log('[Error Text Data]', text);
      return {
        status: response.status,
        message: response.statusText,
        errors: { detail: text }
      };
    } catch (error) {
      console.error('[Error Parsing Failed]', error);
      return {
        status: response.status,
        message: response.statusText,
        errors: {}
      };
    }
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