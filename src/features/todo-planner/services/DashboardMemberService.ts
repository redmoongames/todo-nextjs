import { 
  DashboardMember,
  AddMemberData,
  UpdateMemberData
} from '../types/Models';
import {
  DashboardMembersResult,
  MemberOperationResult,
  OperationResult
} from '../types/Responses';
import { IDashboardMemberService } from '../types/Interfaces';
import { httpService } from '@/common/http';

export class DashboardMemberService implements IDashboardMemberService {
  private static instance: DashboardMemberService;
  
  private constructor() {}
  
  public static getInstance(): DashboardMemberService {
    if (!DashboardMemberService.instance) {
      DashboardMemberService.instance = new DashboardMemberService();
    }
    return DashboardMemberService.instance;
  }

  public async getDashboardMembers(dashboardId: string): Promise<DashboardMembersResult> {
    try {
      const response = await httpService.get<DashboardMember[]>(`/api/todo/dashboards/${dashboardId}/members`);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }
      
      return {
        success: true,
        members: response.data as DashboardMember[]
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
      
      const response = await httpService.post<DashboardMember>(`/api/todo/dashboards/${dashboardId}/members`, data);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }
      
      return {
        success: true,
        member: response.data as DashboardMember
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
      const response = await httpService.put<DashboardMember>(`/api/todo/dashboards/${dashboardId}/members/${memberId}`, data);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }
      
      return {
        success: true,
        member: response.data as DashboardMember
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
      const response = await httpService.delete(`/api/todo/dashboards/${dashboardId}/members/${memberId}`);
      
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

  private validateMemberData(data: AddMemberData): boolean {
    return !!data.email?.trim() && !!data.role && ['editor', 'viewer'].includes(data.role);
  }
  
  private handleApiError(error: unknown): string {
    return error instanceof Error ? error.message : 'An unexpected error occurred';
  }
}

export const dashboardMemberService = DashboardMemberService.getInstance(); 