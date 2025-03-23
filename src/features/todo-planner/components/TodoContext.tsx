import { createContext } from 'react';
import { 
  Todo,
  TodoFilterOptions,
  CreateTodoInput,
  UpdateTodoInput
} from '../types/index';
import { ApiResponse } from '@/common/http/types';

export interface TodoContextType {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  currentDashboardId: string | null;
  setCurrentDashboard: (dashboardId: string) => void;
  fetchTodos: (options?: TodoFilterOptions) => Promise<void>;
  createTodo: (input: CreateTodoInput) => Promise<ApiResponse<Todo>>;
  updateTodo: (todoId: number | string, input: UpdateTodoInput) => Promise<ApiResponse<Todo>>;
  deleteTodo: (todoId: number | string) => Promise<ApiResponse<void>>;
  completeTodo: (todoId: number | string) => Promise<ApiResponse<Todo>>;
  uncompleteTodo: (todoId: number | string) => Promise<ApiResponse<Todo>>;
  searchTodos: (query: string, options?: TodoFilterOptions) => Promise<ApiResponse<Todo[]>>;
}

export const TodoContext = createContext<TodoContextType | null>(null); 