import { useState } from 'react';
import { todoService } from '../services/TodoService';
import { OperationResult } from '../types';

export function useDeleteTodo(dashboardId: string | null) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTodo = async (todoId: number | string): Promise<OperationResult> => {
    if (!dashboardId) {
      return { success: false, error: 'No dashboard selected' };
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await todoService.deleteTodo(dashboardId, String(todoId));
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete todo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    deleteTodo,
    isSubmitting,
    error
  };
} 