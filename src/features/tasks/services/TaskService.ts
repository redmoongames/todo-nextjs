import { httpService } from '@/shared/http';
import { 
  ITaskService, 
  Task, 
  TaskResult, 
  TasksResult, 
  CreateTaskData, 
  UpdateTaskData 
} from '../types';

export class TaskService implements ITaskService {
  private static instance: TaskService;
  
  private constructor() {}
  
  public static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }
  
  public async getTasks(): Promise<TasksResult> {
    try {
      const response = await httpService.get<Task[]>('/tasks');
      
      if (!response.success) {
        return {
          success: false,
          message: response.error || 'Failed to fetch tasks'
        };
      }
      
      return {
        success: true,
        tasks: response.data
      };
    } catch (error) {
      return this.handleTaskError(error);
    }
  }
  
  public async getTaskById(id: string): Promise<TaskResult> {
    try {
      const response = await httpService.get<Task>(`/tasks/${id}`);
      
      if (!response.success) {
        return {
          success: false,
          message: response.error || `Failed to fetch task with ID ${id}`
        };
      }
      
      return {
        success: true,
        task: response.data
      };
    } catch (error) {
      return this.handleTaskError(error);
    }
  }
  
  public async createTask(data: CreateTaskData): Promise<TaskResult> {
    try {
      const response = await httpService.post<Task>('/tasks', data);
      
      if (!response.success) {
        return {
          success: false,
          message: response.error || 'Failed to create task'
        };
      }
      
      return {
        success: true,
        task: response.data,
        message: 'Task created successfully'
      };
    } catch (error) {
      return this.handleTaskError(error);
    }
  }
  
  public async updateTask(id: string, data: UpdateTaskData): Promise<TaskResult> {
    try {
      const response = await httpService.patch<Task>(`/tasks/${id}`, data);
      
      if (!response.success) {
        return {
          success: false,
          message: response.error || `Failed to update task with ID ${id}`
        };
      }
      
      return {
        success: true,
        task: response.data,
        message: 'Task updated successfully'
      };
    } catch (error) {
      return this.handleTaskError(error);
    }
  }
  
  public async deleteTask(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await httpService.delete(`/tasks/${id}`);
      
      if (!response.success) {
        return {
          success: false,
          message: response.error || `Failed to delete task with ID ${id}`
        };
      }
      
      return {
        success: true,
        message: 'Task deleted successfully'
      };
    } catch (error) {
      return this.handleTaskError(error);
    }
  }
  
  public async completeTask(id: string): Promise<TaskResult> {
    return this.updateTask(id, { completed: true });
  }
  
  private handleTaskError(error: unknown): TasksResult {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return {
      success: false,
      message: errorMessage
    };
  }
}

export const taskService = TaskService.getInstance(); 