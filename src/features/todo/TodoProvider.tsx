'use client';

import { ReactNode, useState, useCallback } from 'react';
import { TodoContext, TodoContextType } from './contexts/TodoContext';
import {
  useCreateTodo,
  useUpdateTodo,
  useDeleteTodo,
  useCompleteTodo,
  useUncompleteTodo,
  useSearchTodos,
  useFetchTodos
} from './hooks';
import { Todo, Task, CompletedTask, TodoFilterOptions, CreateTodoInput, UpdateTodoInput } from './types';
import { ApiResponse } from '@/shared/http/types';

interface TodoProviderProps {
  children: ReactNode;
}

// Helper function to convert null to undefined for due_date
function convertTodoForContext(todo: any): Todo {
  return {
    ...todo,
    due_date: todo.due_date === null ? undefined : todo.due_date
  } as Todo;
}

export function TodoProvider({ children }: TodoProviderProps) {
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

  // Wrapper methods that convert types
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

  const updateTodo = useCallback(async (todoId: number, input: UpdateTodoInput): Promise<ApiResponse<Todo>> => {
    const result = await originalUpdateTodo(todoId, input);
    if (result.success && result.data) {
      return {
        ...result,
        data: convertTodoForContext(result.data)
      };
    }
    return result as ApiResponse<Todo>;
  }, [originalUpdateTodo]);

  const deleteTodo = useCallback(async (todoId: number): Promise<ApiResponse<void>> => {
    return originalDeleteTodo(todoId);
  }, [originalDeleteTodo]);

  const completeTodo = useCallback(async (todoId: number): Promise<ApiResponse<Todo>> => {
    const result = await originalCompleteTodo(todoId);
    if (result.success && result.data) {
      return {
        ...result,
        data: convertTodoForContext(result.data)
      };
    }
    return result as ApiResponse<Todo>;
  }, [originalCompleteTodo]);

  const uncompleteTodo = useCallback(async (todoId: number): Promise<ApiResponse<Todo>> => {
    const result = await originalUncompleteTodo(todoId);
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

  // Implement legacy methods for dashboard client
  const getTasks = useCallback(async (): Promise<Task[] | null> => {
    try {
      await fetchTodos();
      return todos as Task[];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return null;
    }
  }, [fetchTodos, todos]);

  const getUncompletedTasks = useCallback((tasks: Task[] | null): Task[] => {
    if (!tasks) return [];
    return tasks.filter(task => task.status !== 'completed');
  }, []);

  const getCompletedTasks = useCallback((tasks: Task[] | null): CompletedTask[] => {
    if (!tasks) return [];
    return tasks.filter(task => task.status === 'completed') as CompletedTask[];
  }, []);

  const completeTaskAndGetUpdated = useCallback(async (taskId: string): Promise<CompletedTask | null> => {
    try {
      const result = await completeTodo(Number(taskId));
      if (result.success && result.data) {
        return result.data as CompletedTask;
      }
      return null;
    } catch (error) {
      console.error("Error completing task:", error);
      return null;
    }
  }, [completeTodo]);

  const deleteTask = useCallback(async (taskId: string): Promise<boolean> => {
    try {
      const result = await deleteTodo(Number(taskId));
      return result.success;
    } catch (error) {
      console.error("Error deleting task:", error);
      return false;
    }
  }, [deleteTodo]);

  const value: TodoContextType = {
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
    searchTodos,
    // Legacy methods
    getTasks,
    getUncompletedTasks,
    getCompletedTasks,
    completeTaskAndGetUpdated,
    deleteTask
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
} 