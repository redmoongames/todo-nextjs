import { useState, useCallback } from 'react';
import { TodoFilterOptions, TodoResult } from '../types';
import { todoService } from '../services/TodoService';

export function useSearchTodos(dashboardId: string | null) {
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchTodos = useCallback(async (query: string, filters?: TodoFilterOptions): Promise<TodoResult> => {
    if (!dashboardId) {
      return { success: false, error: 'No dashboard selected' };
    }

    setIsSearching(true);
    setError(null);

    try {
      const result = await todoService.searchTodos(dashboardId, query, filters);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search todos';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSearching(false);
    }
  }, [dashboardId]);

  return {
    searchTodos,
    isSearching,
    error
  };
} 