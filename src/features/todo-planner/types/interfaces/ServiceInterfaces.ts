import { 
  TodoFilterOptions,
  TodoResult,
  TodoOperationResult,
  OperationResult,
  TagResult,
  TagOperationResult,
  DashboardResult,
  DashboardOperationResult,
  MemberResult,
  MemberOperationResult
} from '../index';

import {
  CreateTodoInput,
  UpdateTodoInput,
  CreateTagInput,
  UpdateTagInput,
  CreateDashboardInput,
  UpdateDashboardInput
} from '../api/RequestTypes';

export interface ITodoService {
  getTodos(dashboardId: string, filters?: TodoFilterOptions): Promise<TodoResult>;
  getTodoById(dashboardId: string, todoId: string): Promise<TodoOperationResult>;
  createTodo(dashboardId: string, data: CreateTodoInput): Promise<TodoOperationResult>;
  updateTodo(dashboardId: string, todoId: string, data: UpdateTodoInput): Promise<TodoOperationResult>;
  deleteTodo(dashboardId: string, todoId: string | number): Promise<OperationResult>;
  completeTodo(dashboardId: string, todoId: string): Promise<TodoOperationResult>;
  uncompleteTodo(dashboardId: string, todoId: string): Promise<TodoOperationResult>;
  searchTodos(dashboardId: string, query: string, filters?: TodoFilterOptions): Promise<TodoResult>;
}

export interface ITagService {
  getTags(dashboardId: string): Promise<TagResult>;
  getTagById(dashboardId: string, tagId: string): Promise<TagOperationResult>;
  createTag(dashboardId: string, data: CreateTagInput): Promise<TagOperationResult>;
  updateTag(dashboardId: string, tagId: string, data: UpdateTagInput): Promise<TagOperationResult>;
  deleteTag(dashboardId: string, tagId: string): Promise<OperationResult>;
}

export interface IDashboardService {
  getDashboards(): Promise<DashboardResult>;
  getDashboardById(id: string): Promise<DashboardOperationResult>;
  createDashboard(data: CreateDashboardInput): Promise<DashboardOperationResult>;
  updateDashboard(id: string, data: UpdateDashboardInput): Promise<DashboardOperationResult>;
  deleteDashboard(id: string): Promise<OperationResult>;
}

export interface IDashboardMemberService {
  getDashboardMembers(dashboardId: string): Promise<MemberResult>;
  addDashboardMember(dashboardId: string, data: { email: string; role: string }): Promise<MemberOperationResult>;
  updateDashboardMember(dashboardId: string, memberId: string, data: { role: string }): Promise<MemberOperationResult>;
  removeDashboardMember(dashboardId: string, memberId: string): Promise<OperationResult>;
} 