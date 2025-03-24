import { createContext } from 'react';
import { 
  Todo,
  TodoFilterOptions,
  CreateTodoInput,
  UpdateTodoInput,
  TodoOperationResult,
  OperationResult,
  TodoResult
} from '../types/index';

export interface TodoContextType {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  currentDashboardId: string | null;
  setCurrentDashboard: (dashboardId: string) => void;
  fetchTodos: (options?: TodoFilterOptions) => Promise<void>;
  createTodo: (input: CreateTodoInput) => Promise<TodoOperationResult>;
  updateTodo: (todoId: number | string, input: UpdateTodoInput) => Promise<TodoOperationResult>;
  deleteTodo: (todoId: number | string) => Promise<OperationResult>;
  completeTodo: (todoId: number | string) => Promise<TodoOperationResult>;
  uncompleteTodo: (todoId: number | string) => Promise<TodoOperationResult>;
  searchTodos: (query: string, options?: TodoFilterOptions) => Promise<TodoResult>;
}

export const TodoContext = createContext<TodoContextType | null>(null); 