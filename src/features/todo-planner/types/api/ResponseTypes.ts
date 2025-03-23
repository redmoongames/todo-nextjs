import { Dashboard, DashboardMember } from '../core/DashboardTypes';
import { Tag, Todo } from '../core/TodoTypes';
import { ApiResponse } from '@/common/http/types';

export type TodoResponse = ApiResponse<Todo>;
export type TodosResponse = ApiResponse<Todo[]>;
export type TagResponse = ApiResponse<Tag>;
export type TagsResponse = ApiResponse<Tag[]>;
export type DashboardResponse = ApiResponse<Dashboard>;
export type DashboardsResponse = ApiResponse<Dashboard[]>;
export type MemberResponse = ApiResponse<DashboardMember>;
export type MembersResponse = ApiResponse<DashboardMember[]>; 