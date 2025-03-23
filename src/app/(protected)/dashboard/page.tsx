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
      
      if (result.dashboard) {
        setDashboards((prev: Dashboard[]): Dashboard[] => [...prev, result.dashboard as Dashboard]);
        closeModal();
      }
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

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading..." />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-100">My Dashboards</h1>
        <div className="flex space-x-4">
          <button
            onClick={openCreateDashboardModal}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </div>
      <DashboardList 
        dashboards={dashboards} 
        onDelete={handleDeleteDashboard}
      />
    </div>
  );
}
