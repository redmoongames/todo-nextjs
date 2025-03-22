import { useState, useCallback } from 'react';
import { TodoFilterOptions } from '../types';
import { Todo } from '../types/Models';
import { todoService } from '../services/TodoService';
import { ApiResponse } from '@/shared/http/types';

export function useSearchTodos(dashboardId: string | null) {
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchTodos = useCallback(async (query: string, options?: TodoFilterOptions): Promise<ApiResponse<Todo[]>> => {
    if (!dashboardId) {
      const errorMessage = 'No dashboard selected';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }

    try {
      setIsSearching(true);
      setError(null);
      
      const response = await todoService.searchTodos(dashboardId, query, options);
      
      setIsSearching(false);
      
      if (!response.success) {
        setError(response.error || 'Failed to search todos');
      }
      
      return response;
    } catch (error) {
      setIsSearching(false);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }, [dashboardId]);

  return {
    searchTodos,
    isSearching,
    error,
    clearError: () => setError(null)
  };
} 