import { useState } from 'react';
import { todoService } from '../services/TodoService';
import { TodoOperationResult } from '../types';

export function useUncompleteTodo(dashboardId: string | null) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uncompleteTodo = async (todoId: number | string): Promise<TodoOperationResult> => {
    if (!dashboardId) {
      return { success: false, error: 'No dashboard selected' };
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await todoService.uncompleteTodo(dashboardId, String(todoId));
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to uncomplete todo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    uncompleteTodo,
    isSubmitting,
    error
  };
} 