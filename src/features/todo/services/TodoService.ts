import { 
  Todo, 
  CreateTodoData, 
  UpdateTodoData,
  TodoFilters
} from '../types/Models';
import {
  TodoResult,
  TodoDetailResult,
  TodoOperationResult,
  OperationResult
} from '../types/Responses';
import { ITodoService } from '../types/Interfaces';
import { httpService } from '@/shared/http';
import { 
  buildTodoEndpoint, 
  buildTodoFiltersQuery,
  buildSearchEndpoint,
  handleApiError 
} from './ApiUtils';

export class TodoService implements ITodoService {
  private static instance: TodoService;
  
  private constructor() {}
  
  public static getInstance(): TodoService {
    if (!TodoService.instance) {
      TodoService.instance = new TodoService();
    }
    return TodoService.instance;
  }

  public async getTodos(dashboardId: string, filters?: TodoFilters): Promise<TodoResult> {
    try {
      const queryString = buildTodoFiltersQuery(filters);
      const endpoint = `${buildTodoEndpoint(dashboardId, 'todos')}${queryString}`;
      const response = await httpService.get<Todo[]>(endpoint);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }
      
      return {
        success: true,
        todos: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  }

  public async getTodoById(dashboardId: string, todoId: string): Promise<TodoDetailResult> {
    try {
      const response = await httpService.get<Todo>(buildTodoEndpoint(dashboardId, `todos/${todoId}`));
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }
      
      return {
        success: true,
        todo: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
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
      
      const response = await httpService.post<Todo>(buildTodoEndpoint(dashboardId, 'todos'), data);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }
      
      return {
        success: true,
        todo: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  }

  public async updateTodo(dashboardId: string, todoId: string, data: UpdateTodoData): Promise<TodoOperationResult> {
    try {
      const response = await httpService.put<Todo>(buildTodoEndpoint(dashboardId, `todos/${todoId}`), data);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }
      
      return {
        success: true,
        todo: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  }

  public async deleteTodo(dashboardId: string, todoId: string): Promise<OperationResult> {
    try {
      const response = await httpService.delete(buildTodoEndpoint(dashboardId, `todos/${todoId}`));
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }
      
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  }

  public async completeTodo(dashboardId: string, todoId: string): Promise<TodoOperationResult> {
    try {
      const endpoint = buildTodoEndpoint(dashboardId, `todos/${todoId}/complete`);
      const response = await httpService.post<Todo>(endpoint);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }
      
      return {
        success: true,
        todo: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  }

  public async uncompleteTodo(dashboardId: string, todoId: string): Promise<TodoOperationResult> {
    try {
      const endpoint = buildTodoEndpoint(dashboardId, `todos/${todoId}/uncomplete`);
      const response = await httpService.post<Todo>(endpoint);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }
      
      return {
        success: true,
        todo: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  }

  public async searchTodos(dashboardId: string, query: string, filters?: TodoFilters): Promise<TodoResult> {
    try {
      let queryParams = new URLSearchParams();
      queryParams.append('q', query);
      
      if (filters) {
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.priority) queryParams.append('priority', String(filters.priority));
        if (filters.tags?.length) queryParams.append('tags', filters.tags.join(','));
      }
      
      const endpoint = `${buildSearchEndpoint(dashboardId)}?${queryParams.toString()}`;
      const response = await httpService.get<Todo[]>(endpoint);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }
      
      return {
        success: true,
        todos: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  }

  private validateTodoData(data: CreateTodoData): boolean {
    return Boolean(data.title && data.title.trim());
  }
}

export const todoService = TodoService.getInstance(); 