import { 
  Todo, 
  CreateTodoData,
  UpdateTodoData,
  TodoResult,
  TodoDetailResult,
  TodoOperationResult,
  OperationResult,
  TodoFilters,
  ITodoService
} from '../types/index';

export class TodoService implements ITodoService {
  private async fetch<T>(endpoint: string, init?: RequestInit): Promise<T> {
    const response = await fetch(endpoint, {
      ...init,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  }

  public async getTodos(dashboardId: string, filters?: TodoFilters): Promise<TodoResult> {
    try {
      let endpoint = `/api/todo/dashboards/${dashboardId}/todos`;
      
      if (filters) {
        const queryParams = new URLSearchParams();
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.priority) queryParams.append('priority', String(filters.priority));
        if (filters.tags?.length) queryParams.append('tags', filters.tags.join(','));
        
        const queryString = queryParams.toString();
        if (queryString) {
          endpoint += `?${queryString}`;
        }
      }
      
      const data = await this.fetch<{ todos: Todo[] }>(endpoint);
      
      return {
        success: true,
        todos: data.todos
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch todos'
      };
    }
  }

  public async getTodoById(dashboardId: string, todoId: string): Promise<TodoDetailResult> {
    try {
      const todo = await this.fetch<Todo>(`/api/todo/dashboards/${dashboardId}/todos/${todoId}`);
      
      return {
        success: true,
        todo
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch todo'
      };
    }
  }

  public async createTodo(dashboardId: string, data: CreateTodoData): Promise<TodoOperationResult> {
    try {
      if (!this.validateTodoData(data)) {
        return {
          success: false,
          error: 'Todo title is required'
        };
      }
      
      const todo = await this.fetch<Todo>(`/api/todo/dashboards/${dashboardId}/todos`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      
      return {
        success: true,
        todo
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create todo'
      };
    }
  }

  public async updateTodo(dashboardId: string, todoId: string, data: UpdateTodoData): Promise<TodoOperationResult> {
    try {
      const todo = await this.fetch<Todo>(`/api/todo/dashboards/${dashboardId}/todos/${todoId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      
      return {
        success: true,
        todo
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update todo'
      };
    }
  }

  public async deleteTodo(dashboardId: string, todoId: string): Promise<OperationResult> {
    try {
      await this.fetch(`/api/todo/dashboards/${dashboardId}/todos/${todoId}`, {
        method: 'DELETE'
      });
      
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete todo'
      };
    }
  }

  public async completeTodo(dashboardId: string, todoId: string): Promise<TodoOperationResult> {
    try {
      const todo = await this.fetch<Todo>(`/api/todo/dashboards/${dashboardId}/todos/${todoId}/complete`, {
        method: 'POST'
      });
      
      return {
        success: true,
        todo
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to complete todo'
      };
    }
  }

  public async uncompleteTodo(dashboardId: string, todoId: string): Promise<TodoOperationResult> {
    try {
      const todo = await this.fetch<Todo>(`/api/todo/dashboards/${dashboardId}/todos/${todoId}/uncomplete`, {
        method: 'POST'
      });
      
      return {
        success: true,
        todo
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to uncomplete todo'
      };
    }
  }

  public async searchTodos(dashboardId: string, query: string, filters?: TodoFilters): Promise<TodoResult> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('q', query);
      
      if (filters) {
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.priority) queryParams.append('priority', String(filters.priority));
        if (filters.tags?.length) queryParams.append('tags', filters.tags.join(','));
      }
      
      const endpoint = `/api/todo/dashboards/${dashboardId}/search?${queryParams.toString()}`;
      
      const data = await this.fetch<{ todos: Todo[] }>(endpoint);
      
      return {
        success: true,
        todos: data.todos
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search todos'
      };
    }
  }

  private validateTodoData(data: CreateTodoData): boolean {
    return Boolean(data.title?.trim());
  }
}

export const todoService = new TodoService(); 