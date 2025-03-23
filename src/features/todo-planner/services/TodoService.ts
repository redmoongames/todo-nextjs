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
import { httpService } from '@/common/http';

interface TodoResponse {
  todos?: Todo[];
  todo?: Todo;
  [key: string]: unknown;
}

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
      
      const response = await httpService.get<TodoResponse>(endpoint);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }
      
      // Parse the nested structure correctly
      let todosArray: Todo[] = [];
      
      if (response.data?.todos && Array.isArray(response.data.todos)) {
        todosArray = response.data.todos;
      } else if (Array.isArray(response.data)) {
        todosArray = response.data;
      }
      
      return {
        success: true,
        todos: todosArray
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleApiError(error)
      };
    }
  }

  public async getTodoById(dashboardId: string, todoId: string): Promise<TodoDetailResult> {
    try {
      const response = await httpService.get<Todo>(`/api/todo/dashboards/${dashboardId}/todos/${todoId}`);
      
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
        error: this.handleApiError(error)
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
      
      const response = await httpService.post<Todo>(`/api/todo/dashboards/${dashboardId}/todos`, data);
      
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
        error: this.handleApiError(error)
      };
    }
  }

  public async updateTodo(dashboardId: string, todoId: string, data: UpdateTodoData): Promise<TodoOperationResult> {
    try {
      const response = await httpService.put<Todo>(`/api/todo/dashboards/${dashboardId}/todos/${todoId}`, data);
      
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
        error: this.handleApiError(error)
      };
    }
  }

  public async deleteTodo(dashboardId: string, todoId: string): Promise<OperationResult> {
    try {
      const response = await httpService.delete(`/api/todo/dashboards/${dashboardId}/todos/${todoId}`);
      
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
        error: this.handleApiError(error)
      };
    }
  }

  public async completeTodo(dashboardId: string, todoId: string): Promise<TodoOperationResult> {
    try {
      const response = await httpService.post<Todo>(`/api/todo/dashboards/${dashboardId}/todos/${todoId}/complete`);
      
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
        error: this.handleApiError(error)
      };
    }
  }

  public async uncompleteTodo(dashboardId: string, todoId: string): Promise<TodoOperationResult> {
    try {
      const response = await httpService.post<Todo>(`/api/todo/dashboards/${dashboardId}/todos/${todoId}/uncomplete`);
      
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
        error: this.handleApiError(error)
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
      
      const response = await httpService.get<TodoResponse>(endpoint);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }
      
      // Parse the nested structure correctly
      let todosArray: Todo[] = [];
      
      if (response.data?.todos && Array.isArray(response.data.todos)) {
        todosArray = response.data.todos;
      } else if (Array.isArray(response.data)) {
        todosArray = response.data;
      }
      
      return {
        success: true,
        todos: todosArray
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleApiError(error)
      };
    }
  }

  private validateTodoData(data: CreateTodoData): boolean {
    return !!data.title?.trim();
  }
  
  private handleApiError(error: unknown): string {
    return error instanceof Error ? error.message : 'An unexpected error occurred';
  }
}

export const todoService = TodoService.getInstance(); 