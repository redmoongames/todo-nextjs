export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority?: TaskPriority;
  completed: boolean;
  created_at: string;
  updated_at?: string;
  labels?: Label[];
  user_id: number;
  completedAt?: string;
}

export interface CompletedTask extends Task {
  completed: true;
  completedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: TaskPriority;
  labels?: string[]; // Label IDs
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  completed?: boolean;
  labels?: string[]; // Label IDs
}

export interface TodoServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
} 