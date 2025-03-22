import { Dashboard, CreateDashboardData, UpdateDashboardData } from '../types/Models';
import { 
  DashboardResult,
  DashboardDetailResult,
  DashboardOperationResult,
  OperationResult 
} from '../types/Responses';
import { IDashboardService } from '../types/Interfaces';
import { httpService } from '@/shared/http';
import { buildEndpoint, handleApiError } from './ApiUtils';

export class DashboardService implements IDashboardService {
  private static instance: DashboardService;
  
  private constructor() {}
  
  public static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  public async getDashboards(): Promise<DashboardResult> {
    try {
      const response = await httpService.get<Dashboard[]>(buildEndpoint('todo/dashboards'));
      
      if (!response.success) {
        return { 
          success: false, 
          error: response.error 
        };
      }
      
      return { 
        success: true, 
        dashboards: response.data 
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  }

  public async getDashboardById(id: string): Promise<DashboardDetailResult> {
    try {
      const response = await httpService.get<Dashboard>(buildEndpoint(`todo/dashboards/${id}`));
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }
      
      return {
        success: true,
        dashboard: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  }

  public async createDashboard(data: CreateDashboardData): Promise<DashboardOperationResult> {
    try {
      if (!this.validateDashboardData(data)) {
        return {
          success: false,
          error: 'Dashboard title is required'
        };
      }
      
      const response = await httpService.post<Dashboard>(buildEndpoint('todo/dashboards'), data);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }
      
      return {
        success: true,
        dashboard: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  }

  public async updateDashboard(id: string, data: UpdateDashboardData): Promise<DashboardOperationResult> {
    try {
      const response = await httpService.put<Dashboard>(buildEndpoint(`todo/dashboards/${id}`), data);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }
      
      return {
        success: true,
        dashboard: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  }

  public async deleteDashboard(id: string): Promise<OperationResult> {
    try {
      const response = await httpService.delete(buildEndpoint(`todo/dashboards/${id}`));
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }
      
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  }

  private validateDashboardData(data: CreateDashboardData): boolean {
    return Boolean(data.title && data.title.trim());
  }
}

export const dashboardService = DashboardService.getInstance(); 
