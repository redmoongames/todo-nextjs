export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  completed: boolean;
  created_at: string;
  updated_at?: string;
  labels?: Label[];
  user_id: number;
}

export interface CompletedTask {
  id: string;
  title: string;
  completedAt: Date;
  completedBy: {
    name: string;
    avatar: string;
  };
}

export interface TodoServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
} 