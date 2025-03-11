import { useCallback } from 'react';
import { useTodo } from './TodoProvider';
import { Task } from './types';

/**
 * Hook to access the TodoService instance
 */
export function useTodoService() {
  const { todoService } = useTodo();
  
  // Task methods
  const getTasks = useCallback(
    () => todoService.getTasks(),
    [todoService]
  );
  
  const completeTask = useCallback(
    (taskId: string) => todoService.completeTask(taskId),
    [todoService]
  );
  
  const deleteTask = useCallback(
    (taskId: string) => todoService.deleteTask(taskId),
    [todoService]
  );
  
  const createTask = useCallback(
    (taskData: Partial<Task>) => todoService.createTask(taskData),
    [todoService]
  );
  
  const updateTask = useCallback(
    (taskId: string, taskData: Partial<Task>) => todoService.updateTask(taskId, taskData),
    [todoService]
  );
  
  const completeTaskAndGetUpdated = useCallback(
    (taskId: string, tasks: Task[]) => todoService.completeTaskAndGetUpdated(taskId, tasks),
    [todoService]
  );
  
  // Label methods
  const getLabels = useCallback(
    () => todoService.getLabels(),
    [todoService]
  );
  
  const createLabel = useCallback(
    (labelData: { name: string; color: string }) => todoService.createLabel(labelData),
    [todoService]
  );
  
  const deleteLabel = useCallback(
    (labelId: string) => todoService.deleteLabel(labelId),
    [todoService]
  );
  
  // Helper methods
  const getUncompletedTasks = useCallback(
    (tasks: Task[]) => todoService.getUncompletedTasks(tasks),
    [todoService]
  );
  
  const getCompletedTasks = useCallback(
    (tasks: Task[]) => todoService.getCompletedTasks(tasks),
    [todoService]
  );
  
  return {
    // Task methods
    getTasks,
    completeTask,
    deleteTask,
    createTask,
    updateTask,
    completeTaskAndGetUpdated,
    
    // Label methods
    getLabels,
    createLabel,
    deleteLabel,
    
    // Helper methods
    getUncompletedTasks,
    getCompletedTasks
  };
} 