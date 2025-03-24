import { useState, useCallback } from 'react';
import { 
  Todo,
  TodoFilterOptions,
  CreateTodoInput,
  UpdateTodoInput,
  TodoOperationResult,
  OperationResult,
  TodoResult
} from '../types';
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

  const createTodo = useCallback(async (input: CreateTodoInput): Promise<TodoOperationResult> => {
    const result = await originalCreateTodo(input);
    if (result.success && result.todo) {
      return {
        ...result,
        todo: convertTodoForContext(result.todo)
      };
    }
    return result;
  }, [originalCreateTodo]);

  const updateTodo = useCallback(async (todoId: number | string, input: UpdateTodoInput): Promise<TodoOperationResult> => {
    const result = await originalUpdateTodo(todoId, input);
    if (result.success && result.todo) {
      return {
        ...result,
        todo: convertTodoForContext(result.todo)
      };
    }
    return result;
  }, [originalUpdateTodo]);

  const deleteTodo = useCallback(async (todoId: number | string): Promise<OperationResult> => {
    return originalDeleteTodo(todoId);
  }, [originalDeleteTodo]);

  const completeTodo = useCallback(async (todoId: number | string): Promise<TodoOperationResult> => {
    const result = await originalCompleteTodo(todoId);
    if (result.success && result.todo) {
      return {
        ...result,
        todo: convertTodoForContext(result.todo)
      };
    }
    return result;
  }, [originalCompleteTodo]);

  const uncompleteTodo = useCallback(async (todoId: number | string): Promise<TodoOperationResult> => {
    const result = await originalUncompleteTodo(todoId);
    if (result.success && result.todo) {
      return {
        ...result,
        todo: convertTodoForContext(result.todo)
      };
    }
    return result;
  }, [originalUncompleteTodo]);

  const searchTodos = useCallback(async (query: string, options?: TodoFilterOptions): Promise<TodoResult> => {
    const result = await originalSearchTodos(query, options);
    if (result.success && result.todos) {
      return {
        ...result,
        todos: result.todos.map(convertTodoForContext)
      };
    }
    return result;
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