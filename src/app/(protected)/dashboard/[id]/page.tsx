'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/common-ui/LoadingSpinner';
import { ErrorMessage } from '@/features/auth/components/ErrorMessage';
import { Dashboard, Todo } from '@/features/todo-planner';
import { dashboardService } from '@/features/todo-planner/services/DashboardService';
import { todoService } from '@/features/todo-planner/services/TodoService';
import { DashboardAddTaskPopup } from '@/common-ui/popups';
import { useModal } from '@/features/modal';
import Link from 'next/link';

// Simple Modal component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div 
        className="z-50 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

interface DashboardDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function DashboardDetailPage({ params }: DashboardDetailPageProps): React.ReactElement {
  const router = useRouter();
  const { id: dashboardId } = React.use(params);
  const { openModal, closeModal } = useModal();
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);

  async function fetchDashboardAndTodos(): Promise<void> {
    try {
      setIsLoading(true);
      setError(null);
      setPermissionDenied(false);
      
      const dashboardResult = await dashboardService.getDashboardById(dashboardId);
      
      if (!dashboardResult.success) {
        if (dashboardResult.error?.includes('permission') || 
            dashboardResult.error?.includes('access') || 
            dashboardResult.error?.includes('403')) {
          setPermissionDenied(true);
          throw new Error('You do not have permission to access this dashboard');
        }
        
        throw new Error(dashboardResult.error || 'Failed to fetch dashboard');
      }
      
      if (!dashboardResult.dashboard) {
        throw new Error('Dashboard not found');
      }
      
      setDashboard(dashboardResult.dashboard);
      
      const todosResult = await todoService.getTodos(dashboardId);
      
      if (!todosResult.success) {
        throw new Error(todosResult.error || 'Failed to fetch todos');
      }
      
      setTodos(Array.isArray(todosResult.todos) ? todosResult.todos : []);
    } catch (error: unknown) {
      const errorMessage: string = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardAndTodos();
  }, [dashboardId]);

  const handleAddTask = () => {
    openModal(
      <DashboardAddTaskPopup 
        dashboardId={dashboardId} 
        onClose={closeModal} 
        onSuccess={() => {
          closeModal();
          fetchDashboardAndTodos();
        }}
      />
    );
  };

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading dashboard..." />;
  }

  if (permissionDenied) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-6 max-w-md">
          <h2 className="text-2xl font-bold text-red-300 mb-4">Access Denied</h2>
          <p className="text-red-200 mb-6">
            This dashboard is locked. You need permission from the dashboard owner to view it.
          </p>
          <Link 
            href="/dashboard" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Return to My Dashboards
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link 
          href="/dashboard" 
          className="text-blue-400 hover:text-blue-300 mb-4 inline-block"
        >
          &larr; Back to My Dashboards
        </Link>
        <h1 className="text-3xl font-bold text-gray-100 mt-2">{dashboard?.title}</h1>
        {dashboard?.description && (
          <p className="text-gray-300 mt-2">{dashboard.description}</p>
        )}
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-100">Tasks</h2>
          <button
            onClick={handleAddTask}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add New Task
          </button>
        </div>
        
        {todos.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p>No tasks found in this dashboard.</p>
            <p className="mt-2">Start by adding a new task.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {Array.isArray(todos) ? todos.map((todo) => (
              <div 
                key={todo.id} 
                className="bg-gray-700 rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-medium text-gray-100">
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p className="text-gray-300 text-sm mt-1">{todo.description}</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {Array.isArray(todo.tags) && todo.tags.map((tag) => (
                      <span 
                        key={tag.id}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: tag.color ? `${tag.color}40` : '#9CA3AF40',
                          color: tag.color || '#9CA3AF'
                        }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    todo.status === 'completed' 
                      ? 'bg-green-900/30 text-green-300' 
                      : 'bg-yellow-900/30 text-yellow-300'
                  }`}>
                    {todo.status === 'completed' ? 'Completed' : 'Pending'}
                  </span>
                  <span className="px-2 py-1 bg-gray-600 rounded-md text-xs font-medium">
                    Priority: {todo.priority}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-10 text-gray-400">
                <p>Error loading tasks.</p>
                <p className="mt-2">Please refresh the page to try again.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 