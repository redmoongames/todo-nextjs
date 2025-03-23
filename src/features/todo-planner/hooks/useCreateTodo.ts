import { useState, useCallback } from 'react';
import { CreateTodoInput } from '../types/api/RequestTypes';
import { Todo } from '../types/core/TodoTypes';
import { todoService } from '../services/TodoService';
import { ApiResponse } from '@/common/http/types';

export function useCreateTodo(dashboardId: string | null) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTodo = useCallback(async (input: CreateTodoInput): Promise<ApiResponse<Todo>> => {
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
      
      const response = await todoService.createTodo(dashboardId, input);
      
      setIsSubmitting(false);
      
      if (!response.success) {
        setError(response.error || 'Failed to create todo');
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
    createTodo,
    isSubmitting,
    error,
    clearError: () => setError(null)
  };
} 