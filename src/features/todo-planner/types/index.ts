// Re-export core types
export * from './core/TodoTypes';
export * from './core/DashboardTypes';

// Re-export API types
export * from './api/RequestTypes';
export * from './api/ResponseTypes';

// Re-export interfaces
export * from './interfaces/ServiceInterfaces';

// Base response type
export interface BaseResponse {
  success: boolean;
  error?: string;
}

// Legacy aliases for backward compatibility
import { Todo, TodoFilterOptions, Tag } from './core/TodoTypes';
import { Dashboard, DashboardMember } from './core/DashboardTypes';
import { CreateTodoInput, UpdateTodoInput, CreateDashboardInput, UpdateDashboardInput } from './api/RequestTypes';

// Old Models.ts exports
export type TodoFilters = TodoFilterOptions;
export type CreateTodoData = CreateTodoInput;
export type UpdateTodoData = UpdateTodoInput;
export type CreateDashboardData = CreateDashboardInput;
export type UpdateDashboardData = UpdateDashboardInput;

// Response types
export interface TodoResult extends BaseResponse {
  todos?: Todo[];
}

export interface TodoDetailResult extends BaseResponse {
  todo?: Todo;
}

export interface TodoOperationResult extends BaseResponse {
  todo?: Todo;
}

export interface DashboardResult extends BaseResponse {
  dashboards?: Dashboard[];
}

export interface DashboardDetailResult extends BaseResponse {
  dashboard?: Dashboard;
}

export interface DashboardOperationResult extends BaseResponse {
  dashboard?: Dashboard;
}

export interface OperationResult extends BaseResponse {
  status?: 'success' | 'error';
}

// Member result types
export interface MemberResult extends BaseResponse {
  members?: DashboardMember[];
}

export interface MemberDetailResult extends BaseResponse {
  member?: DashboardMember;
}

export interface MemberOperationResult extends BaseResponse {
  member?: DashboardMember;
}

// Tag result types
export interface TagResult extends BaseResponse {
  tags?: Tag[];
}

export interface TagDetailResult extends BaseResponse {
  tag?: Tag;
}

export interface TagOperationResult extends BaseResponse {
  tag?: Tag;
} 