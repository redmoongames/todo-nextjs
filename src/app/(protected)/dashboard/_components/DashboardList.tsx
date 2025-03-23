'use client';

import React from 'react';
import { Dashboard } from '@/features/todo-planner';
import { DashboardCard, DashboardWithStats } from './DashboardCard';
import { EmptyDashboardState } from './EmptyDashboardState';
import { useDashboardStats } from './hooks/useDashboardStats';

interface DashboardListProps {
  dashboards: Dashboard[] | DashboardWithStats[];
  onDelete: (dashboardId: string) => Promise<void>;
  isLoading?: boolean;
}

export function DashboardList({ dashboards, onDelete, isLoading: externalLoading }: DashboardListProps): React.ReactElement {
  const { dashboardsWithStats, isLoading: statsLoading } = useDashboardStats(dashboards);

  // Combine external loading state with internal stats loading
  const isLoading = externalLoading || statsLoading;

  // Convert any dashboard without stats by merging with dashboardsWithStats
  const processedDashboards = dashboards.map(dashboard => {
    // Check if this dashboard already has stats from parent component
    if ('taskStats' in dashboard) {
      return dashboard as DashboardWithStats;
    }
    
    // Otherwise, find it in dashboardsWithStats
    const dashboardWithStats = dashboardsWithStats.find(d => d.id === dashboard.id);
    
    if (dashboardWithStats) {
      return dashboardWithStats;
    }
    
    // Fallback: return dashboard with empty stats
    return {
      ...dashboard,
      taskStats: {
        total: 0,
        completed: 0,
        pending: 0
      }
    };
  });
  
  if (processedDashboards.length === 0 && !isLoading) {
    return <EmptyDashboardState />;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {isLoading && (
        <div className="text-center text-gray-400 py-4">
          Updating dashboard data...
        </div>
      )}
      {processedDashboards.map((dashboard) => (
        <DashboardCard 
          key={dashboard.id}
          dashboard={dashboard}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
} 