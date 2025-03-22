import { useState, useCallback } from 'react';
import { Todo } from '../types/Models';
import { todoService } from '../services/TodoService';
import { ApiResponse } from '@/shared/http/types';

export function useUncompleteTodo(dashboardId: string | null) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uncompleteTodo = useCallback(async (todoId: number): Promise<ApiResponse<Todo>> => {
    if (!dashboardId) {
      const errorMessage = 'No dashboard selected';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await todoService.uncompleteTodo(dashboardId, todoId.toString());
      
      setIsSubmitting(false);
      
      if (!response.success) {
        setError(response.error || 'Failed to uncomplete todo');
      }
      
      return response;
    } catch (error) {
      setIsSubmitting(false);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }, [dashboardId]);

  return {
    uncompleteTodo,
    isSubmitting,
    error,
    clearError: () => setError(null)
  };
} 