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
import { httpService } from '@/shared/http';
import { buildTodoEndpoint, handleApiError } from './ApiUtils';

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
      const response = await httpService.get<DashboardMember[]>(buildTodoEndpoint(dashboardId, 'members'));
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }
      
      return {
        success: true,
        members: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
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
      
      const response = await httpService.post<DashboardMember>(buildTodoEndpoint(dashboardId, 'members'), data);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }
      
      return {
        success: true,
        member: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  }

  public async updateDashboardMember(dashboardId: string, memberId: string, data: UpdateMemberData): Promise<MemberOperationResult> {
    try {
      const response = await httpService.put<DashboardMember>(buildTodoEndpoint(dashboardId, `members/${memberId}`), data);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }
      
      return {
        success: true,
        member: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  }

  public async removeDashboardMember(dashboardId: string, memberId: string): Promise<OperationResult> {
    try {
      const response = await httpService.delete(buildTodoEndpoint(dashboardId, `members/${memberId}`));
      
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

  private validateMemberData(data: AddMemberData): boolean {
    return Boolean(
      data.email && 
      data.email.trim() && 
      data.role && 
      ['editor', 'viewer'].includes(data.role)
    );
  }
}

export const dashboardMemberService = DashboardMemberService.getInstance(); 