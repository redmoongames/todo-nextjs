import { useState, useCallback } from 'react';
import { 
  Todo,
  TodoFilterOptions,
  CreateTodoInput,
  UpdateTodoInput,
  ApiResponse
} from '../types/index';
import { TodoContextType } from '../components/TodoContext';

import {
  useCreateTodo,
  useUpdateTodo,
  useDeleteTodo,
  useCompleteTodo,
  useUncompleteTodo,
  useSearchTodos,
  useFetchTodos
} from '.';

// Helper function to convert null to undefined for due_date
function convertTodoForContext(todo: Todo): Todo {
  return {
    ...todo,
    due_date: todo.due_date === null ? undefined : todo.due_date
  } as Todo;
}

export function useTodoContext(): TodoContextType {
  const [currentDashboardId, setCurrentDashboardId] = useState<string | null>(null);
  
  const {
    todos: originalTodos,
    isLoading,
    error,
    fetchTodos: originalFetchTodos
  } = useFetchTodos(currentDashboardId);
  
  const { createTodo: originalCreateTodo } = useCreateTodo(currentDashboardId);
  const { updateTodo: originalUpdateTodo } = useUpdateTodo(currentDashboardId);
  const { deleteTodo: originalDeleteTodo } = useDeleteTodo(currentDashboardId);
  const { completeTodo: originalCompleteTodo } = useCompleteTodo(currentDashboardId);
  const { uncompleteTodo: originalUncompleteTodo } = useUncompleteTodo(currentDashboardId);
  const { searchTodos: originalSearchTodos } = useSearchTodos(currentDashboardId);

  // Convert todos for context
  const todos = originalTodos.map(convertTodoForContext);
  
  const setCurrentDashboard = useCallback((dashboardId: string) => {
    setCurrentDashboardId(dashboardId);
  }, []);

  // Wrapper methods that ensure type compatibility
  const fetchTodos = useCallback(async (options?: TodoFilterOptions): Promise<void> => {
    return originalFetchTodos(options);
  }, [originalFetchTodos]);

  const createTodo = useCallback(async (input: CreateTodoInput): Promise<ApiResponse<Todo>> => {
    const result = await originalCreateTodo(input);
    if (result.success && result.data) {
      return {
        ...result,
        data: convertTodoForContext(result.data)
      };
    }
    return result as ApiResponse<Todo>;
  }, [originalCreateTodo]);

  const updateTodo = useCallback(async (todoId: number | string, input: UpdateTodoInput): Promise<ApiResponse<Todo>> => {
    const numericId = typeof todoId === 'string' ? parseInt(todoId) : todoId;
    const result = await originalUpdateTodo(numericId, input);
    if (result.success && result.data) {
      return {
        ...result,
        data: convertTodoForContext(result.data)
      };
    }
    return result as ApiResponse<Todo>;
  }, [originalUpdateTodo]);

  const deleteTodo = useCallback(async (todoId: number | string): Promise<ApiResponse<void>> => {
    const numericId = typeof todoId === 'string' ? parseInt(todoId) : todoId;
    return originalDeleteTodo(numericId);
  }, [originalDeleteTodo]);

  const completeTodo = useCallback(async (todoId: number | string): Promise<ApiResponse<Todo>> => {
    const numericId = typeof todoId === 'string' ? parseInt(todoId) : todoId;
    const result = await originalCompleteTodo(numericId);
    if (result.success && result.data) {
      return {
        ...result,
        data: convertTodoForContext(result.data)
      };
    }
    return result as ApiResponse<Todo>;
  }, [originalCompleteTodo]);

  const uncompleteTodo = useCallback(async (todoId: number | string): Promise<ApiResponse<Todo>> => {
    const numericId = typeof todoId === 'string' ? parseInt(todoId) : todoId;
    const result = await originalUncompleteTodo(numericId);
    if (result.success && result.data) {
      return {
        ...result,
        data: convertTodoForContext(result.data)
      };
    }
    return result as ApiResponse<Todo>;
  }, [originalUncompleteTodo]);

  const searchTodos = useCallback(async (query: string, options?: TodoFilterOptions): Promise<ApiResponse<Todo[]>> => {
    const result = await originalSearchTodos(query, options);
    if (result.success && result.data) {
      return {
        ...result,
        data: result.data.map(convertTodoForContext)
      };
    }
    return result as ApiResponse<Todo[]>;
  }, [originalSearchTodos]);

  return {
    todos,
    isLoading,
    error,
    currentDashboardId,
    setCurrentDashboard,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    completeTodo,
    uncompleteTodo,
    searchTodos
  };
} 