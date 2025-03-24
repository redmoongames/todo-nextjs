import { 
  Dashboard, 
  CreateDashboardData,
  UpdateDashboardData,
  DashboardResult,
  DashboardDetailResult,
  DashboardOperationResult,
  OperationResult,
  IDashboardService,
  DashboardsResponse
} from '../types/index';

export class DashboardService implements IDashboardService {
  private static instance: DashboardService;
  private readonly baseUrl = '/api/todo/dashboards';
  
  private constructor() {}
  
  public static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  public async getDashboards(): Promise<DashboardResult> {
    try {
      const response = await fetch(this.baseUrl, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.message || 'Failed to fetch dashboards' };
      }
      
      const dashboards: Dashboard[] = this.extractDashboards(data);
      return { success: true, dashboards };
    } catch (error) {
      return { success: false, error: this.handleApiError(error) };
    }
  }

  private extractDashboards(data: Dashboard[] | DashboardsResponse): Dashboard[] {
    return Array.isArray(data) 
      ? data 
      : data?.dashboards ?? [];
  }

  public async getDashboardById(id: string): Promise<DashboardDetailResult> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to fetch dashboard'
        };
      }
      
      return {
        success: true,
        dashboard: data
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
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: responseData.message || 'Failed to create dashboard'
        };
      }
      
      return {
        success: true,
        dashboard: responseData
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
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: responseData.message || 'Failed to update dashboard'
        };
      }
      
      return {
        success: true,
        dashboard: responseData
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
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to delete dashboard'
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
    return Boolean(data.title?.trim());
  }
  
  private handleApiError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }
}

export const dashboardService = DashboardService.getInstance(); 
