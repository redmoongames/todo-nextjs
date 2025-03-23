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
        <div className="bg-black border border-red-800 rounded-lg p-6 max-w-md">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h2>
          <p className="text-gray-400 mb-6">
            This dashboard is locked. You need permission from the dashboard owner to view it.
          </p>
          <Link 
            href="/dashboard" 
            className="inline-block px-4 py-2 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors duration-200"
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

  const completedTodos = todos.filter(todo => todo.status === 'completed');
  const completionPercentage = todos.length > 0 
    ? Math.round((completedTodos.length / todos.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-1 mb-6"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.5 12.5L4.5 8L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Dashboards
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">{dashboard?.title}</h1>
              {dashboard?.description && (
                <p className="mt-2 text-gray-400 max-w-2xl">{dashboard.description}</p>
              )}
            </div>
            
            <button
              onClick={handleAddTask}
              className="px-4 py-2 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors duration-200 whitespace-nowrap"
            >
              Add New Task
            </button>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-800 rounded-lg p-6 bg-gradient-to-b from-gray-900 to-black">
              <div className="text-sm text-gray-500 mb-1">Total Tasks</div>
              <div className="text-3xl font-bold">{todos.length}</div>
            </div>
            
            <div className="border border-gray-800 rounded-lg p-6 bg-gradient-to-b from-gray-900 to-black">
              <div className="text-sm text-gray-500 mb-1">Completed</div>
              <div className="text-3xl font-bold text-green-400">{completedTodos.length}</div>
            </div>
            
            <div className="border border-gray-800 rounded-lg p-6 bg-gradient-to-b from-gray-900 to-black">
              <div className="text-sm text-gray-500 mb-1">Completion</div>
              <div className="text-3xl font-bold">{completionPercentage}%</div>
              <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-400"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border border-gray-800 rounded-lg bg-gradient-to-b from-gray-900 to-black p-6">
          <h2 className="text-xl font-semibold mb-6">Tasks</h2>
          
          {todos.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 mx-auto text-gray-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-400 mb-2">No tasks found in this dashboard.</p>
              <p className="text-gray-600">Start by adding a new task.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Array.isArray(todos) ? todos.map((todo) => (
                <div 
                  key={todo.id} 
                  className="border border-gray-800 rounded-lg p-5 hover:border-gray-700 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-lg text-white">
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className="text-gray-400 text-sm mt-1">{todo.description}</p>
                      )}
                      {Array.isArray(todo.tags) && todo.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {todo.tags.map((tag) => (
                            <span 
                              key={tag.id}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: tag.color ? `${tag.color}20` : '#9CA3AF20',
                                color: tag.color || '#9CA3AF'
                              }}
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 shrink-0">
                      <span className={`px-3 py-1 rounded-md text-xs font-medium ${
                        todo.status === 'completed' 
                          ? 'bg-green-900/20 text-green-400 border border-green-900/50' 
                          : 'bg-yellow-900/20 text-yellow-400 border border-yellow-900/50'
                      }`}>
                        {todo.status === 'completed' ? 'Completed' : 'Pending'}
                      </span>
                      <span className="px-3 py-1 bg-gray-800 rounded-md text-xs font-medium border border-gray-700">
                        P{todo.priority}
                      </span>
                    </div>
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
    </div>
  );
} 