import { createContext } from 'react';
import { CreateTodoInput, UpdateTodoInput, TodoFilterOptions, Todo, Task, CompletedTask } from '../types';
import { ApiResponse } from '@/shared/http/types';

export interface TodoContextType {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  currentDashboardId: string | null;
  setCurrentDashboard: (dashboardId: string) => void;
  fetchTodos: (options?: TodoFilterOptions) => Promise<void>;
  createTodo: (input: CreateTodoInput) => Promise<ApiResponse<Todo>>;
  updateTodo: (todoId: number, input: UpdateTodoInput) => Promise<ApiResponse<Todo>>;
  deleteTodo: (todoId: number) => Promise<ApiResponse<void>>;
  completeTodo: (todoId: number) => Promise<ApiResponse<Todo>>;
  uncompleteTodo: (todoId: number) => Promise<ApiResponse<Todo>>;
  searchTodos: (query: string, options?: TodoFilterOptions) => Promise<ApiResponse<Todo[]>>;
  
  // Legacy methods for dashboard client
  getTasks: () => Promise<Task[] | null>;
  getUncompletedTasks: (tasks: Task[] | null) => Task[];
  getCompletedTasks: (tasks: Task[] | null) => CompletedTask[];
  completeTaskAndGetUpdated: (taskId: string, tasks: Task[]) => Promise<CompletedTask | null>;
  deleteTask: (taskId: string) => Promise<boolean>;
}

export const TodoContext = createContext<TodoContextType | null>(null); 