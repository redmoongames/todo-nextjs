'use client';

import React, { useState, useEffect, useRef, ReactElement, useCallback } from 'react';
import { Task, CompletedTask, useTodoService } from '@/todo';
import { useModal } from '@/modal/ModalProvider';
import { TaskDetailsModal } from '@/modal/modals';
import { useAuth } from '@/auth';

import { TasksContainer } from './_components/TasksContainer';
import { LoadingSpinner } from './_components/LoadingSpinner';
import { ErrorDisplay } from './_components/ErrorDisplay';

export default function Page(): ReactElement {
  const { openModal } = useModal();
  const { logout } = useAuth();
  const todoService = useTodoService();
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const hasFetchedRef = useRef<boolean>(false);

  const fetchTasks = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const fetchedTasks: Task[] | null = await todoService.getTasks();
      if (!fetchedTasks) {
        throw new Error('Failed to fetch tasks');
      }
      
      setTasks(todoService.getUncompletedTasks(fetchedTasks));
      setCompletedTasks(todoService.getCompletedTasks(fetchedTasks));
    } catch (error: unknown) {
      const errorMessage: string = error instanceof Error ? error.message : 'Failed to load tasks. Please try again later.';
      setError(errorMessage);
      openModal(
        <div className="p-4 text-red-400">
          {errorMessage}
        </div>
      );
    } finally {
      setIsLoading(false);
    }
  }, [todoService, openModal]);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      console.log('[DASHBOARD] Fetching tasks');
      fetchTasks();
      hasFetchedRef.current = true;
    }
  }, [fetchTasks]);

  const handleLogout = async () => {
    console.log('[DASHBOARD] Logging out...');
    await logout();
    // Middleware will handle the redirect to login page
  };

  async function handleTaskComplete(taskId: string): Promise<void> {
    try {
      const completedTask: CompletedTask | null = await todoService.completeTaskAndGetUpdated(taskId, tasks);
      
      if (completedTask) {
        setCompletedTasks((prev: CompletedTask[]): CompletedTask[] => [completedTask, ...prev]);
        setTasks((prev: Task[]): Task[] => prev.filter((task: Task): boolean => task.id !== taskId));
      }
    } catch (error: unknown) {
      const errorMessage: string = error instanceof Error ? error.message : 'Failed to complete task. Please try again.';
      openModal(
        <div className="p-4 text-red-400">
          {errorMessage}
        </div>
      );
    }
  }

  async function handleTaskDelete(taskId: string): Promise<void> {
    try {
      const success: boolean = await todoService.deleteTask(taskId);
      if (!success) {
        throw new Error('Failed to delete task');
      }
      
      setTasks((prev: Task[]): Task[] => prev.filter((task: Task): boolean => task.id !== taskId));
    } catch (error: unknown) {
      const errorMessage: string = error instanceof Error ? error.message : 'Failed to delete task. Please try again.';
      openModal(
        <div className="p-4 text-red-400">
          {errorMessage}
        </div>
      );
    }
  }

  function handleTaskClick(task: Task): void {
    openModal(
      <TaskDetailsModal
        task={task}
        onComplete={handleTaskComplete}
        onDelete={handleTaskDelete}
      />
    );
  }

  // Show loading state while loading tasks
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Show error state if there's an error
  if (error) {
    return <ErrorDisplay message={error} />;
  }
  
  return (
    <div>
      <div className="flex justify-end p-4">
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
      <TasksContainer
        tasks={tasks}
        completedTasks={completedTasks}
        onTaskComplete={handleTaskComplete}
        onTaskDelete={handleTaskDelete}
        onTaskClick={handleTaskClick}
      />
    </div>
  );
}
