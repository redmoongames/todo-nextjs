import {
  AddMemberData, 
  CreateDashboardData, 
  CreateTagData, 
  CreateTodoData,
  TodoFilters,
  UpdateDashboardData,
  UpdateMemberData,
  UpdateTagData,
  UpdateTodoData
} from './Models';

import {
  DashboardDetailResult,
  DashboardMembersResult,
  DashboardOperationResult,
  DashboardResult,
  MemberOperationResult,
  OperationResult,
  TagOperationResult,
  TagResult,
  TodoDetailResult,
  TodoOperationResult,
  TodoResult
} from './Responses';

export interface IDashboardService {
  getDashboards(): Promise<DashboardResult>;
  getDashboardById(id: string): Promise<DashboardDetailResult>;
  createDashboard(data: CreateDashboardData): Promise<DashboardOperationResult>;
  updateDashboard(id: string, data: UpdateDashboardData): Promise<DashboardOperationResult>;
  deleteDashboard(id: string): Promise<OperationResult>;
}

export interface IDashboardMemberService {
  getDashboardMembers(dashboardId: string): Promise<DashboardMembersResult>;
  addDashboardMember(dashboardId: string, data: AddMemberData): Promise<MemberOperationResult>;
  updateDashboardMember(dashboardId: string, memberId: string, data: UpdateMemberData): Promise<MemberOperationResult>;
  removeDashboardMember(dashboardId: string, memberId: string): Promise<OperationResult>;
}

export interface ITodoService {
  getTodos(dashboardId: string, filters?: TodoFilters): Promise<TodoResult>;
  getTodoById(dashboardId: string, todoId: string): Promise<TodoDetailResult>;
  createTodo(dashboardId: string, data: CreateTodoData): Promise<TodoOperationResult>;
  updateTodo(dashboardId: string, todoId: string, data: UpdateTodoData): Promise<TodoOperationResult>;
  deleteTodo(dashboardId: string, todoId: string): Promise<OperationResult>;
  completeTodo(dashboardId: string, todoId: string): Promise<TodoOperationResult>;
  uncompleteTodo(dashboardId: string, todoId: string): Promise<TodoOperationResult>;
  searchTodos(dashboardId: string, query: string, filters?: TodoFilters): Promise<TodoResult>;
}

export interface ITagService {
  getTags(dashboardId: string): Promise<TagResult>;
  createTag(dashboardId: string, data: CreateTagData): Promise<TagOperationResult>;
  updateTag(dashboardId: string, tagId: string, data: UpdateTagData): Promise<TagOperationResult>;
  deleteTag(dashboardId: string, tagId: string): Promise<OperationResult>;
} 