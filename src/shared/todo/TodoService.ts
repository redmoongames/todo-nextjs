import { Task, CompletedTask } from './types';

export interface TodoServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export class TodoService {
  private static instance: TodoService;
  private readonly API_URL: string;

  private constructor() {
    this.API_URL = '/api'; // Use the Next.js API routes
  }

  public static getInstance(): TodoService {
    if (!TodoService.instance) {
      TodoService.instance = new TodoService();
    }
    return TodoService.instance;
  }

  /**
   * Makes an authenticated request to the API
   */
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<TodoServiceResponse<T>> {
    try {
      // Make the request
      const url = `${this.API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      console.debug(`[TODO] Making request to ${url}`);
      
      const response = await fetch(url, {
        ...options,
        credentials: 'include', // Include cookies for session authentication
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });
      
      // Parse the response
      const data = await response.json().catch(() => ({}));
      
      // Check if the response was successful
      if (!response.ok) {
        return { 
          success: false, 
          error: data.message || data.error || `Request failed: ${response.statusText}` 
        };
      }
      
      return { 
        success: true, 
        data: data.data || data 
      };
    } catch (error) {
      console.error("[TODO] API request error:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  /**
   * Fetches all tasks for the current user
   */
  async getTasks(): Promise<Task[] | null> {
    try {
      const response = await this.makeRequest<{ items: Task[] }>('/todo/tasks');
      
      if (!response.success || !response.data) {
        console.error("[TODO] Error fetching tasks:", response.error);
        return null;
      }
      
      return response.data.items;
    } catch (error) {
      console.error("[TODO] Error fetching tasks:", error);
      return null;
    }
  }

  /**
   * Filters tasks by completion status
   */
  getUncompletedTasks(tasks: Task[]): Task[] {
    return tasks.filter(task => !task.completed);
  }

  /**
   * Filters tasks by completion status and converts to CompletedTask type
   */
  getCompletedTasks(tasks: Task[]): CompletedTask[] {
    return tasks
      .filter(task => task.completed)
      .map(task => ({
        ...task,
        completed: true,
        completedAt: task.completedAt || new Date().toISOString()
      }));
  }

  /**
   * Marks a task as completed
   */
  async completeTask(taskId: string): Promise<boolean> {
    try {
      const response = await this.makeRequest(`/todo/tasks/${taskId}/complete`, {
        method: 'POST',
      });
      
      return response.success;
    } catch (error) {
      console.error("[TODO] Error completing task:", error);
      return false;
    }
  }

  /**
   * Updates task, marks as completed, and returns the updated task
   */
  async completeTaskAndGetUpdated(taskId: string, currentTasks: Task[]): Promise<CompletedTask | null> {
    const success = await this.completeTask(taskId);
    
    if (!success) {
      return null;
    }
    
    // Find the task that was completed
    const task = currentTasks.find(t => t.id === taskId);
    
    if (!task) {
      return null;
    }
    
    // Return the task with completed status
    return {
      ...task,
      completed: true,
      completedAt: new Date().toISOString()
    };
  }

  /**
   * Deletes a task
   */
  async deleteTask(taskId: string): Promise<boolean> {
    try {
      const response = await this.makeRequest(`/todo/tasks/${taskId}`, {
        method: 'DELETE',
      });
      
      return response.success;
    } catch (error) {
      console.error("[TODO] Error deleting task:", error);
      return false;
    }
  }

  /**
   * Creates a new task
   */
  async createTask(taskData: Partial<Task>): Promise<boolean> {
    try {
      const response = await this.makeRequest('/todo/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      });
      
      return response.success;
    } catch (error) {
      console.error("[TODO] Error creating task:", error);
      return false;
    }
  }

  /**
   * Updates an existing task
   */
  async updateTask(taskId: string, taskData: Partial<Task>): Promise<boolean> {
    try {
      const response = await this.makeRequest(`/todo/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(taskData),
      });
      
      return response.success;
    } catch (error) {
      console.error("[TODO] Error updating task:", error);
      return false;
    }
  }
} 