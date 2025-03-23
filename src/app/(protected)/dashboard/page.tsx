'use client';

import React, { useState, useEffect } from 'react';
import { useModal } from '@/features/modal';
import { useAuthState } from '@/features/auth';
import { Dashboard, CreateDashboardData } from '@/features/todo-planner/types/index';
import { dashboardService } from '@/features/todo-planner/services/DashboardService';
import { LoadingSpinner } from '@/common-ui/LoadingSpinner';
import { ErrorMessage } from '@/features/auth/components/ErrorMessage';
import { CreateDashboardPopup } from '@/common-ui/popups';
import { DashboardList } from './_components/DashboardList';
import { DashboardWithStats } from './_components/DashboardCard';

export default function DashboardPage(): React.ReactElement {
  const { openModal, closeModal } = useModal();
  const { logout } = useAuthState();
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);

  async function fetchDashboards(): Promise<void> {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await dashboardService.getDashboards();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch dashboards');
      }
      
      setDashboards(result.dashboards || []);
    } catch (error: unknown) {
      const errorMessage: string = error instanceof Error ? error.message : 'Failed to load dashboards. Please try again later.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboards();
  }, []);

  const handleLogout = async (): Promise<void> => {
    await logout();
  };

  const handleCreateDashboard = async (data: CreateDashboardData): Promise<void> => {
    try {
      const result = await dashboardService.createDashboard(data);
      if (!result.success) {
        throw new Error(result.error || 'Failed to create dashboard');
      }
      
      // On successful creation, refresh the entire dashboard list
      // This ensures we get proper formatted data from the server
      await fetchDashboards();
      closeModal();
    } catch (error: unknown) {
      const errorMessage: string = error instanceof Error ? error.message : 'Failed to create dashboard. Please try again.';
      openModal(
        <div className="p-4 text-red-400">
          {errorMessage}
        </div>
      );
    }
  };

  const handleDeleteDashboard = async (dashboardId: string): Promise<void> => {
    try {
      const result = await dashboardService.deleteDashboard(dashboardId);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete dashboard');
      }
      
      // Update the local state to reflect the deletion
      setDashboards((prev: Dashboard[]): Dashboard[] => 
        prev.filter((dashboard: Dashboard): boolean => dashboard.id !== dashboardId)
      );
    } catch (error: unknown) {
      const errorMessage: string = error instanceof Error ? error.message : 'Failed to delete dashboard. Please try again.';
      openModal(
        <div className="p-4 text-red-400">
          {errorMessage}
        </div>
      );
    }
  };

  const openCreateDashboardModal = (): void => {
    openModal(<CreateDashboardPopup onSubmit={handleCreateDashboard} onCancel={closeModal} />);
  };

  if (isLoading && dashboards.length === 0) {
    return <LoadingSpinner size="large" text="Loading dashboards..." />;
  }

  if (error && dashboards.length === 0) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">My Dashboards</h1>
            <p className="mt-2 text-gray-400 max-w-2xl">
              Organize your tasks and boost productivity with custom dashboards.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={openCreateDashboardModal}
              className="px-4 py-2 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors duration-200"
            >
              New Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-gray-700 text-gray-300 font-medium rounded-md hover:bg-gray-900 hover:border-gray-600 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
        
        <DashboardList 
          dashboards={dashboards} 
          onDelete={handleDeleteDashboard}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
