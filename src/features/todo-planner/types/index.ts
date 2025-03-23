// Re-export core types
export * from './core/TodoTypes';
export * from './core/DashboardTypes';

// Re-export API types
export * from './api/RequestTypes';
export * from './api/ResponseTypes';

// Re-export interfaces
export * from './interfaces/ServiceInterfaces';

// Export common HTTP types
import type { ApiResponse } from '@/common/http/types';
export type { ApiResponse };

// Legacy aliases for backward compatibility
import { Todo, TodoFilterOptions } from './core/TodoTypes';
import { Dashboard } from './core/DashboardTypes';
import { CreateTodoInput, UpdateTodoInput, CreateDashboardInput, UpdateDashboardInput } from './api/RequestTypes';
import { TodoResponse, TodosResponse, DashboardResponse, DashboardsResponse } from './api/ResponseTypes';

// Old Models.ts exports
export type TodoFilters = TodoFilterOptions;
export type CreateTodoData = CreateTodoInput;
export type UpdateTodoData = UpdateTodoInput;
export type CreateDashboardData = CreateDashboardInput;
export type UpdateDashboardData = UpdateDashboardInput;

// Old Responses.ts exports
export interface TodoResult extends ApiResponse<Todo[]> {
  todos?: Todo[];
}
export interface TodoDetailResult extends ApiResponse<Todo> {
  todo?: Todo;
}
export interface TodoOperationResult extends ApiResponse<Todo> {
  todo?: Todo;
}
export interface DashboardResult extends ApiResponse<Dashboard[]> {
  dashboards?: Dashboard[];
}
export interface DashboardDetailResult extends ApiResponse<Dashboard> {
  dashboard?: Dashboard;
}
export interface DashboardOperationResult extends ApiResponse<Dashboard> {
  dashboard?: Dashboard;
}
export interface OperationResult extends ApiResponse<void> {} 