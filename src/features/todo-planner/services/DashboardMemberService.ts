import { 
  DashboardMember,
  DashboardRole,
  OperationResult,
  MemberResult,
  MemberOperationResult
} from '../types';

// Define interfaces for the service imports
interface AddMemberData {
  email: string;
  role: DashboardRole;
}

interface UpdateMemberData {
  role: DashboardRole;
}

interface IDashboardMemberService {
  getDashboardMembers(dashboardId: string): Promise<MemberResult>;
  addDashboardMember(dashboardId: string, data: AddMemberData): Promise<MemberOperationResult>;
  updateDashboardMember(dashboardId: string, memberId: string, data: UpdateMemberData): Promise<MemberOperationResult>;
  removeDashboardMember(dashboardId: string, memberId: string): Promise<OperationResult>;
}

export class DashboardMemberService implements IDashboardMemberService {
  private static instance: DashboardMemberService;
  
  private constructor() {}
  
  public static getInstance(): DashboardMemberService {
    if (!DashboardMemberService.instance) {
      DashboardMemberService.instance = new DashboardMemberService();
    }
    return DashboardMemberService.instance;
  }

  private async fetch<T>(endpoint: string, init?: RequestInit): Promise<T> {
    const response = await fetch(endpoint, {
      ...init,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  }

  public async getDashboardMembers(dashboardId: string): Promise<MemberResult> {
    try {
      const data = await this.fetch<{ members: DashboardMember[] }>(`/api/todo/dashboards/${dashboardId}/members`);
      
      return {
        success: true,
        members: data.members
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleApiError(error)
      };
    }
  }

  public async addDashboardMember(dashboardId: string, data: AddMemberData): Promise<MemberOperationResult> {
    try {
      if (!this.validateMemberData(data)) {
        return {
          success: false,
          error: 'Email and role are required'
        };
      }
      
      const response = await this.fetch<{ member: DashboardMember }>(`/api/todo/dashboards/${dashboardId}/members`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      
      return {
        success: true,
        member: response.member
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleApiError(error)
      };
    }
  }

  public async updateDashboardMember(dashboardId: string, memberId: string, data: UpdateMemberData): Promise<MemberOperationResult> {
    try {
      const response = await this.fetch<{ member: DashboardMember }>(`/api/todo/dashboards/${dashboardId}/members/${memberId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      
      return {
        success: true,
        member: response.member
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleApiError(error)
      };
    }
  }

  public async removeDashboardMember(dashboardId: string, memberId: string): Promise<OperationResult> {
    try {
      await this.fetch(`/api/todo/dashboards/${dashboardId}/members/${memberId}`, {
        method: 'DELETE'
      });
      
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

  private validateMemberData(data: AddMemberData): boolean {
    return !!data.email?.trim() && !!data.role && ['editor', 'viewer'].includes(data.role);
  }
  
  private handleApiError(error: unknown): string {
    return error instanceof Error ? error.message : 'An unexpected error occurred';
  }
}

export const dashboardMemberService = DashboardMemberService.getInstance(); 