import { useState } from 'react';
import { todoService } from '../services/TodoService';
import { TodoOperationResult } from '../types';

export function useCompleteTodo(dashboardId: string | null) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completeTodo = async (todoId: number | string): Promise<TodoOperationResult> => {
    if (!dashboardId) {
      return { success: false, error: 'No dashboard selected' };
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await todoService.completeTodo(dashboardId, String(todoId));
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete todo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    completeTodo,
    isSubmitting,
    error
  };
} 