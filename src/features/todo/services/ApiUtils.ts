import { TodoFilters } from '../types/Models';

export function buildEndpoint(path: string): string {
  return `/api/v1/${path}`;
}

export function buildTodoEndpoint(dashboardId: string, path: string = ''): string {
  return buildEndpoint(`todo/dashboards/${dashboardId}${path ? `/${path}` : ''}`);
}

export function buildSearchEndpoint(dashboardId: string): string {
  return buildTodoEndpoint(dashboardId, 'todos/search');
}

export function buildTodoFiltersQuery(filters?: TodoFilters): string {
  if (!filters) return '';
  
  const params = new URLSearchParams();
  
  if (filters.status) params.append('status', filters.status);
  if (filters.priority) params.append('priority', String(filters.priority));
  if (filters.tags?.length) params.append('tags', filters.tags.join(','));
  if (filters.sort) params.append('sort', filters.sort);
  if (filters.order) params.append('order', filters.order);
  
  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

export function handleApiError(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred';
} 