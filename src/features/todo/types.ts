import { ApiResponse } from '@/shared/http/types';

export type TaskPriority = 1 | 2 | 3 | 4 | 5;
export type DashboardRole = 'owner' | 'editor' | 'viewer';
export type TaskStatus = 'pending' | 'completed';
export type SortOrder = 'asc' | 'desc';
export type SortField = 'created_at' | 'priority' | 'due_date';

export interface Tag {
  id: string;
  name: string;
  color: string;
  dashboard_id: string;
}

export interface Dashboard {
  id: string;
  title: string;
  description: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  owner_id: string;
}

export interface DashboardMember {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
  };
  role: DashboardRole;
  joined_at: string;
}

export interface Todo {
  id: number | string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date?: string;
  created_at: string;
  updated_at?: string;
  completed_at?: string;
  dashboard_id: string;
  tags: Tag[];
}

export interface CreateTodoInput {
  title: string;
  description: string;
  priority: TaskPriority;
  due_date?: string;
  tags?: string[];
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  due_date?: string;
  tags?: string[];
}

export interface CreateTodoData {
  title: string;
  description?: string;
  priority?: TaskPriority;
  due_date?: string;
  tags?: string[]; // Tag IDs
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  due_date?: string;
  tags?: string[]; // Tag IDs
}

export interface CreateTagData {
  name: string;
  color: string;
}

export interface UpdateTagData {
  name?: string;
  color?: string;
}

export interface CreateDashboardData {
  title: string;
  description?: string;
  is_public?: boolean;
}

export interface UpdateDashboardData {
  title?: string;
  description?: string;
  is_public?: boolean;
}

export interface AddMemberData {
  email: string;
  role: DashboardRole;
}

export interface TodoFilterOptions {
  status?: TaskStatus;
  priority?: TaskPriority;
  tags?: string[];
  sort?: SortField;
  order?: SortOrder;
  query?: string;
}

export const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: 1, label: 'Very Low' },
  { value: 2, label: 'Low' },
  { value: 3, label: 'Medium' },
  { value: 4, label: 'High' },
  { value: 5, label: 'Very High' }
];

export type TodoApiResponse<T> = ApiResponse<T>;

// Export todo types for legacy code
export type Task = Todo & {
  labels?: Array<{
    id: string;
    name: string;
    color: string;
  }>;
};

export type CompletedTask = Todo & { 
  status: 'completed';
  completedBy?: {
    name: string;
    avatar: string;
  };
  completedAt?: string;
  labels?: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}; 