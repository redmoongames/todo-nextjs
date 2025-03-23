import { 
  AddMemberInput, 
  CreateDashboardInput, 
  CreateTagInput, 
  CreateTodoInput,
  UpdateDashboardInput,
  UpdateMemberInput,
  UpdateTagInput,
  UpdateTodoInput
} from '../api/RequestTypes';
import {
  DashboardResponse,
  DashboardsResponse,
  MemberResponse,
  MembersResponse,
  TagResponse,
  TagsResponse,
  TodoResponse,
  TodosResponse
} from '../api/ResponseTypes';
import { TodoFilterOptions } from '../core/TodoTypes';
import { ApiResponse } from '@/common/http/types';

export interface ITodoService {
  getTodos(dashboardId: string, filters?: TodoFilterOptions): Promise<TodosResponse>;
  getTodoById(dashboardId: string, todoId: string | number): Promise<TodoResponse>;
  createTodo(dashboardId: string, data: CreateTodoInput): Promise<TodoResponse>;
  updateTodo(dashboardId: string, todoId: string | number, data: UpdateTodoInput): Promise<TodoResponse>;
  deleteTodo(dashboardId: string, todoId: string | number): Promise<ApiResponse<void>>;
  completeTodo(dashboardId: string, todoId: string | number): Promise<TodoResponse>;
  uncompleteTodo(dashboardId: string, todoId: string | number): Promise<TodoResponse>;
  searchTodos(dashboardId: string, query: string, filters?: TodoFilterOptions): Promise<TodosResponse>;
}

export interface ITagService {
  getTags(dashboardId: string): Promise<TagsResponse>;
  createTag(dashboardId: string, data: CreateTagInput): Promise<TagResponse>;
  updateTag(dashboardId: string, tagId: string, data: UpdateTagInput): Promise<TagResponse>;
  deleteTag(dashboardId: string, tagId: string): Promise<ApiResponse<void>>;
}

export interface IDashboardService {
  getDashboards(): Promise<DashboardsResponse>;
  getDashboardById(id: string): Promise<DashboardResponse>;
  createDashboard(data: CreateDashboardInput): Promise<DashboardResponse>;
  updateDashboard(id: string, data: UpdateDashboardInput): Promise<DashboardResponse>;
  deleteDashboard(id: string): Promise<ApiResponse<void>>;
}

export interface IDashboardMemberService {
  getDashboardMembers(dashboardId: string): Promise<MembersResponse>;
  addDashboardMember(dashboardId: string, data: AddMemberInput): Promise<MemberResponse>;
  updateDashboardMember(dashboardId: string, memberId: string, data: UpdateMemberInput): Promise<MemberResponse>;
  removeDashboardMember(dashboardId: string, memberId: string): Promise<ApiResponse<void>>;
} 