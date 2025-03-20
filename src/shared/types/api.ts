/**
 * Base API response interface
 * All API responses should follow this structure
 */
export interface IApiResponse<T = any> {
  /** Whether the request was successful */
  success: boolean;
  /** The response data (if successful) */
  data?: T;
  /** Error message (if unsuccessful) */
  message?: string;
  /** Validation errors (if applicable) */
  errors?: Record<string, string[]>;
}

/**
 * API error interface
 */
export interface IApiError {
  /** HTTP status code */
  status: number;
  /** Error message */
  message: string;
  /** Error details */
  errors?: Record<string, string[]>;
}

/**
 * Pagination metadata
 */
export interface IPaginationMeta {
  /** Current page number */
  page: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of items */
  totalItems: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there is a next page */
  hasNextPage: boolean;
  /** Whether there is a previous page */
  hasPrevPage: boolean;
}

/**
 * Paginated response
 */
export interface IPaginatedResponse<T> {
  /** The items for the current page */
  items: T[];
  /** Pagination metadata */
  meta: IPaginationMeta;
}

/**
 * HTTP methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * API request options
 */
export interface IApiRequestOptions extends RequestInit {
  /** Whether to include credentials */
  withCredentials?: boolean;
  /** Whether to handle errors automatically */
  handleErrors?: boolean;
  /** Custom headers */
  headers?: HeadersInit;
} 