import { useState, useCallback } from 'react';
import { todoService } from '../services/TodoService';
import { ApiResponse } from '@/shared/http/types';

export function useDeleteTodo(dashboardId: string | null) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTodo = useCallback(async (todoId: number): Promise<ApiResponse<void>> => {
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
      
      const response = await todoService.deleteTodo(dashboardId, todoId.toString());
      
      setIsSubmitting(false);
      
      if (!response.success) {
        setError(response.error || 'Failed to delete todo');
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
    deleteTodo,
    isSubmitting,
    error,
    clearError: () => setError(null)
  };
} 