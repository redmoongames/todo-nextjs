import { AuthService } from '@/auth';
import { Task, CompletedTask, Label, TodoServiceResponse } from './types';
import { API_URL, API_ENDPOINTS, DEFAULT_AVATAR } from './constants';
import { getFullUrl } from '../api/config';

export class TodoService {
  private static instance: TodoService;
  private readonly API_URL: string;
  private authService: AuthService;

  private constructor() {
    this.API_URL = API_URL;
    this.authService = AuthService.getInstance();
  }

  public static getInstance(): TodoService {
    if (!TodoService.instance) {
      TodoService.instance = new TodoService();
    }
    return TodoService.instance;
  }

  // Helper method to get full URL for endpoints
  private getEndpointUrl(endpoint: string): string {
    return getFullUrl(endpoint);
  }

  /**
   * Makes an authenticated request to the API
   */
  private async makeAuthenticatedRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<TodoServiceResponse<T>> {
    try {
      // Check if we need to refresh the token
      if (this.authService.needsTokenRefresh()) {
        console.log("[TODO] Token needs refresh, attempting to refresh");
        const refreshed = await this.authService.refreshAccessToken();
        
        if (!refreshed) {
          console.error("[TODO] Token refresh failed");
          return { 
            success: false, 
            error: 'Authentication expired' 
          };
        }
      }

      // Get the (potentially refreshed) token
      const currentToken = this.authService.getAccessToken();
      
      // Make the request with the full URL
      const fullUrl = this.getEndpointUrl(endpoint);
      console.debug(`[TODO] Making request to ${fullUrl}`);
      
      const response = await fetch(fullUrl, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${currentToken}`,
          ...options.headers,
        },
      });

      // Handle 401 Unauthorized
      if (response.status === 401) {
        console.log("[TODO] Received 401, attempting to refresh token");
        const refreshed = await this.authService.refreshAccessToken();
        
        if (refreshed) {
          console.log("[TODO] Token refreshed, retrying request");
          const newToken = this.authService.getAccessToken();
          
          // Retry the request with the new token and full URL
          const retryResponse = await fetch(fullUrl, {
            ...options,
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${newToken}`,
              ...options.headers,
            },
          });
          
          if (!retryResponse.ok) {
            return { 
              success: false, 
              error: `Request failed: ${retryResponse.statusText}` 
            };
          }
          
          const retryData = await retryResponse.json();
          return retryData;
        } else {
          console.error("[TODO] Token refresh failed after 401");
          return { 
            success: false, 
            error: 'Authentication failed' 
          };
        }
      }

      // Handle other errors
      if (!response.ok) {
        return { 
          success: false, 
          error: `Request failed: ${response.statusText}` 
        };
      }

      // Parse and return the response
      const data = await response.json();
      return data;
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
  async getTasks(): Promise<Task[]> {
    try {
      const response = await this.makeAuthenticatedRequest<{ items: Task[] }>(API_ENDPOINTS.TASKS);
      
      if (!response.success || !response.data) {
        console.error("[TODO] Error fetching tasks:", response.error);
        return [];
      }
      
      return response.data.items;
    } catch (error) {
      console.error("[TODO] Error fetching tasks:", error);
      return [];
    }
  }

  /**
   * Marks a task as completed
   */
  async completeTask(taskId: string): Promise<boolean> {
    try {
      const response = await this.makeAuthenticatedRequest(
        API_ENDPOINTS.TASK_BY_ID(taskId), 
        {
          method: 'PUT',
          body: JSON.stringify({ completed: true }),
        }
      );
      
      return response.success;
    } catch (error) {
      console.error("[TODO] Error completing task:", error);
      return false;
    }
  }

  /**
   * Deletes a task
   */
  async deleteTask(taskId: string): Promise<boolean> {
    try {
      const response = await this.makeAuthenticatedRequest(
        API_ENDPOINTS.TASK_BY_ID(taskId), 
        {
          method: 'DELETE',
        }
      );
      
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
      const response = await this.makeAuthenticatedRequest(
        API_ENDPOINTS.TASKS, 
        {
          method: 'POST',
          body: JSON.stringify(taskData),
        }
      );
      
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
      const response = await this.makeAuthenticatedRequest(
        API_ENDPOINTS.TASK_BY_ID(taskId), 
        {
          method: 'PUT',
          body: JSON.stringify(taskData),
        }
      );
      
      return response.success;
    } catch (error) {
      console.error("[TODO] Error updating task:", error);
      return false;
    }
  }

  /**
   * Fetches all labels for the current user
   */
  async getLabels(): Promise<Label[]> {
    try {
      const response = await this.makeAuthenticatedRequest<{ items: Label[] }>(API_ENDPOINTS.LABELS);
      
      if (!response.success || !response.data) {
        console.error("[TODO] Error fetching labels:", response.error);
        return [];
      }
      
      return response.data.items;
    } catch (error) {
      console.error("[TODO] Error fetching labels:", error);
      return [];
    }
  }

  /**
   * Creates a new label
   */
  async createLabel(labelData: { name: string; color: string }): Promise<boolean> {
    try {
      const response = await this.makeAuthenticatedRequest(
        API_ENDPOINTS.LABELS, 
        {
          method: 'POST',
          body: JSON.stringify(labelData),
        }
      );
      
      return response.success;
    } catch (error) {
      console.error("[TODO] Error creating label:", error);
      return false;
    }
  }

  /**
   * Deletes a label
   */
  async deleteLabel(labelId: string): Promise<boolean> {
    try {
      const response = await this.makeAuthenticatedRequest(
        API_ENDPOINTS.LABEL_BY_ID(labelId), 
        {
          method: 'DELETE',
        }
      );
      
      return response.success;
    } catch (error) {
      console.error("[TODO] Error deleting label:", error);
      return false;
    }
  }

  /**
   * Filters tasks to get only uncompleted ones
   */
  public getUncompletedTasks(tasks: Task[]): Task[] {
    return (tasks || []).filter(task => !task.completed);
  }

  /**
   * Filters tasks to get only completed ones and formats them
   */
  public getCompletedTasks(tasks: Task[]): CompletedTask[] {
    return (tasks || [])
      .filter(task => task.completed)
      .map(task => ({
        id: task.id,
        title: task.title,
        completedAt: new Date(task.updated_at || task.created_at),
        completedBy: {
          name: 'You',
          avatar: DEFAULT_AVATAR
        }
      }));
  }

  /**
   * Completes a task and returns it in the CompletedTask format
   */
  public async completeTaskAndGetUpdated(taskId: string, tasks: Task[]): Promise<CompletedTask | null> {
    const success = await this.completeTask(taskId);
    if (!success) return null;

    const completedTask = tasks.find(task => task.id === taskId);
    if (!completedTask) return null;
    
    return {
      id: completedTask.id,
      title: completedTask.title,
      completedAt: new Date(),
      completedBy: {
        name: 'You',
        avatar: DEFAULT_AVATAR
      }
    };
  }
} 