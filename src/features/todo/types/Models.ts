export type DashboardRole = 'owner' | 'editor' | 'viewer';
export type TodoPriority = 1 | 2 | 3 | 4 | 5;
export type TodoStatus = 'pending' | 'completed';
export type SortOrder = 'asc' | 'desc';
export type TodoSortField = 'created_at' | 'priority' | 'due_date';

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
  id: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
  role: DashboardRole;
  joined_at: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  dashboard_id: string;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  priority: TodoPriority;
  status: TodoStatus;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  dashboard_id: string;
  tags: Tag[];
}

// Alias for Todo to support legacy components
export type Task = Todo;
export type CompletedTask = Todo & { status: 'completed' };

export interface TodoFilters {
  status?: TodoStatus;
  priority?: TodoPriority;
  tags?: string[];
  sort?: TodoSortField;
  order?: SortOrder;
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

export interface CreateTodoData {
  title: string;
  description?: string;
  priority?: TodoPriority;
  due_date?: string;
  tags?: string[];
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  priority?: TodoPriority;
  due_date?: string | null;
  tags?: string[];
}

export interface CreateTagData {
  name: string;
  color: string;
}

export interface UpdateTagData {
  name?: string;
  color?: string;
}

export interface AddMemberData {
  email: string;
  role: DashboardRole;
}

export interface UpdateMemberData {
  role: DashboardRole;
} 