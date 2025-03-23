import { 
  Dashboard, 
  CreateDashboardData,
  UpdateDashboardData,
  DashboardResult,
  DashboardDetailResult,
  DashboardOperationResult,
  OperationResult,
  IDashboardService,
  ApiResponse
} from '../types/index';
import { httpService } from '@/common/http';

interface DashboardsResponse {
  dashboards: Dashboard[];
}

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
      const response = await httpService.get<Dashboard[] | DashboardsResponse>('/todo/dashboards');
      if (!response.success) {
        return { success: false, error: response.error };
      }
      const dashboards: Dashboard[] = this.extractDashboards(response);
      return { success: true, dashboards };
    } catch (error) {
      return { success: false, error: this.handleApiError(error) };
    }
  }

  private extractDashboards(response: ApiResponse<Dashboard[] | DashboardsResponse>): Dashboard[] {
    if (response.data) {
      if ('dashboards' in response.data) {
        return response.data.dashboards;
      } else if (Array.isArray(response.data)) {
        return response.data; 
      }
    }
    return [];
  }

  public async getDashboardById(id: string): Promise<DashboardDetailResult> {
    try {
      const response = await httpService.get<Dashboard>(`/todo/dashboards/${id}`);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }
      
      return {
        success: true,
        dashboard: response.data as Dashboard
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleApiError(error)
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
      
      const response = await httpService.post<Dashboard>('/todo/dashboards', data);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }
      
      return {
        success: true,
        dashboard: response.data as Dashboard
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleApiError(error)
      };
    }
  }

  public async updateDashboard(id: string, data: UpdateDashboardData): Promise<DashboardOperationResult> {
    try {
      const response = await httpService.put<Dashboard>(`/todo/dashboards/${id}`, data);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }
      
      return {
        success: true,
        dashboard: response.data as Dashboard
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleApiError(error)
      };
    }
  }

  public async deleteDashboard(id: string): Promise<OperationResult> {
    try {
      console.log('deleting dashboard', id);
      const response = await httpService.delete(`/todo/dashboards/${id}`);
      console.log('response', response);
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
        error: this.handleApiError(error)
      };
    }
  }

  private validateDashboardData(data: CreateDashboardData | UpdateDashboardData): boolean {
    return !!data.title?.trim();
  }
  
  private handleApiError(error: unknown): string {
    return error instanceof Error ? error.message : 'An unexpected error occurred';
  }
}

export const dashboardService = DashboardService.getInstance(); 
