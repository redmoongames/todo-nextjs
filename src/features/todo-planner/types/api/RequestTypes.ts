import { DashboardRole } from '../core/DashboardTypes';
import { TodoPriority, TodoStatus } from '../core/TodoTypes';

export interface CreateTodoInput {
  title: string;
  description: string;
  priority: TodoPriority;
  due_date?: string;
  tags?: string[];
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  priority?: TodoPriority;
  status?: TodoStatus;
  due_date?: string | null;
  tags?: string[];
}

export interface CreateTagInput {
  name: string;
  color: string;
}

export interface UpdateTagInput {
  name?: string;
  color?: string;
}

export interface CreateDashboardInput {
  title: string;
  description?: string;
  is_public?: boolean;
}

export interface UpdateDashboardInput {
  title?: string;
  description?: string;
  is_public?: boolean;
}

export interface AddMemberInput {
  email: string;
  role: DashboardRole;
}

export interface UpdateMemberInput {
  role: DashboardRole;
} 