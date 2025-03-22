export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  completed?: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface TaskResult {
  success: boolean;
  task?: Task;
  message?: string;
}

export interface TasksResult {
  success: boolean;
  tasks?: Task[];
  message?: string;
}

export interface ITaskService {
  getTasks(): Promise<TasksResult>;
  getTaskById(id: string): Promise<TaskResult>;
  createTask(data: CreateTaskData): Promise<TaskResult>;
  updateTask(id: string, data: UpdateTaskData): Promise<TaskResult>;
  deleteTask(id: string): Promise<{ success: boolean; message?: string }>;
  completeTask(id: string): Promise<TaskResult>;
} 