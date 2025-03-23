import { useState, useEffect, useRef } from 'react';
import { Dashboard } from '@/features/todo-planner';
import { todoService } from '@/features/todo-planner/services/TodoService';
import { DashboardWithStats } from '../DashboardCard';

export function useDashboardStats(dashboards: Dashboard[] | DashboardWithStats[]): {
  dashboardsWithStats: DashboardWithStats[];
  isLoading: boolean;
} {
  const [dashboardsWithStats, setDashboardsWithStats] = useState<DashboardWithStats[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const previousDataRef = useRef<Record<string, DashboardWithStats>>({});
  const dashboardsRef = useRef<Dashboard[] | DashboardWithStats[]>([]);
  
  // Compare dashboards to detect changes
  const hasNewDashboards = (): boolean => {
    if (dashboardsRef.current.length !== dashboards.length) {
      return true;
    }
    
    // Check if any dashboard IDs in the current list aren't in the previous list
    const currentIds = new Set(dashboards.map(d => d.id));
    const prevIds = new Set(dashboardsRef.current.map(d => d.id));
    
    return Array.from(currentIds).some(id => !prevIds.has(id));
  };
  
  useEffect(() => {
    // Skip if dashboards array is empty
    if (!dashboards.length) {
      setIsLoading(false);
      return;
    }
    
    // Only set loading to true if we have new dashboards
    if (hasNewDashboards()) {
      setIsLoading(true);
    }
    
    // Update the reference to current dashboards
    dashboardsRef.current = dashboards;
    
    const fetchTaskStats = async (): Promise<void> => {
      const dashboardsArray = Array.isArray(dashboards) ? dashboards : [];
      
      try {
        // Create a map of previous dashboard stats for quick lookup
        const previousStatsMap: Record<string, DashboardWithStats> = {};
        Object.values(previousDataRef.current).forEach(dashboard => {
          previousStatsMap[dashboard.id] = dashboard;
        });
        
        // Identify new dashboards that need immediate fetching
        const newDashboardIds = dashboardsArray
          .filter(d => !previousStatsMap[d.id] && !('taskStats' in d))
          .map(d => d.id);
        
        const enrichedDashboards = await Promise.all(
          dashboardsArray.map(async (dashboard) => {
            // If dashboard already has taskStats, use it
            if ('taskStats' in dashboard) {
              const dashboardWithStats = dashboard as DashboardWithStats;
              previousDataRef.current[dashboard.id] = dashboardWithStats;
              return dashboardWithStats;
            }
            
            // If we have cached stats for this dashboard, use them initially
            if (previousStatsMap[dashboard.id]) {
              const cachedDashboard = {
                ...dashboard,
                taskStats: previousStatsMap[dashboard.id].taskStats
              };
              
              // Only update in background if it's not a brand new dashboard
              if (!newDashboardIds.includes(dashboard.id)) {
                fetchStatsInBackground(dashboard.id, cachedDashboard);
              }
              return cachedDashboard;
            }
            
            // Otherwise, fetch new stats
            try {
              const todosResult = await todoService.getTodos(dashboard.id);
              const todos = Array.isArray(todosResult.todos) ? todosResult.todos : [];
              
              const completed = todos.filter(todo => todo.status === 'completed').length;
              const pending = todos.length - completed;
              
              const dashboardWithStats = {
                ...dashboard,
                taskStats: {
                  total: todos.length,
                  completed,
                  pending
                }
              };
              
              previousDataRef.current[dashboard.id] = dashboardWithStats;
              return dashboardWithStats;
            } catch (error) {
              // Initialize with empty stats on error
              const dashboardWithEmptyStats = {
                ...dashboard,
                taskStats: {
                  total: 0,
                  completed: 0,
                  pending: 0
                }
              };
              
              previousDataRef.current[dashboard.id] = dashboardWithEmptyStats;
              return dashboardWithEmptyStats;
            }
          })
        );
        
        setDashboardsWithStats(enrichedDashboards);
      } catch (error) {
        console.error('Error fetching task stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Fetch stats in background without blocking UI
    const fetchStatsInBackground = async (dashboardId: string, initialDashboard: DashboardWithStats): Promise<void> => {
      try {
        const todosResult = await todoService.getTodos(dashboardId);
        const todos = Array.isArray(todosResult.todos) ? todosResult.todos : [];
        
        const completed = todos.filter(todo => todo.status === 'completed').length;
        const pending = todos.length - completed;
        
        const updatedDashboard = {
          ...initialDashboard,
          taskStats: {
            total: todos.length,
            completed,
            pending
          }
        };
        
        previousDataRef.current[dashboardId] = updatedDashboard;
        
        // Update the state only if the dashboard still exists in the current state
        setDashboardsWithStats(current => 
          current.map(d => d.id === dashboardId ? updatedDashboard : d)
        );
      } catch (error) {
        console.error(`Error updating background stats for dashboard ${dashboardId}:`, error);
      }
    };
    
    fetchTaskStats();
  }, [dashboards]);

  return { dashboardsWithStats, isLoading };
} 