import { useState, useCallback } from 'react';
import { TodoFilterOptions } from '../types';
import { Todo } from '../types/Models';
import { todoService } from '../services/TodoService';

export function useFetchTodos(dashboardId: string | null) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async (options?: TodoFilterOptions): Promise<void> => {
    if (!dashboardId) {
      setError('No dashboard selected');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await todoService.getTodos(dashboardId, options);
      
      if (response.success && response.todos) {
        setTodos(response.todos);
      } else {
        setError(response.error || 'Failed to fetch todos');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [dashboardId]);

  const refresh = useCallback((): Promise<void> => {
    return fetchTodos();
  }, [fetchTodos]);

  return {
    todos,
    isLoading,
    error,
    fetchTodos,
    refresh,
    clearError: () => setError(null)
  };
} 