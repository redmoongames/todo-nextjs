import { useState } from 'react';
import { CreateTodoInput } from '../types/api/RequestTypes';
import { todoService } from '../services/TodoService';
import { TodoOperationResult } from '../types';

export function useCreateTodo(dashboardId: string | null) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTodo = async (input: CreateTodoInput): Promise<TodoOperationResult> => {
    if (!dashboardId) {
      return { success: false, error: 'No dashboard selected' };
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await todoService.createTodo(dashboardId, input);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create todo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createTodo,
    isSubmitting,
    error
  };
} 