import { useState } from 'react';
import { UpdateTodoInput } from '../types/api/RequestTypes';
import { todoService } from '../services/TodoService';
import { TodoOperationResult } from '../types';

export function useUpdateTodo(dashboardId: string | null) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTodo = async (todoId: number | string, input: UpdateTodoInput): Promise<TodoOperationResult> => {
    if (!dashboardId) {
      return { success: false, error: 'No dashboard selected' };
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await todoService.updateTodo(dashboardId, String(todoId), input);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update todo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    updateTodo,
    isSubmitting,
    error
  };
} 