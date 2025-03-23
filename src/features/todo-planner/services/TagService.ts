import { 
  Tag,
  ApiResponse,
  OperationResult
} from '../types/index';

// Define interfaces for the service
interface CreateTagData {
  name: string;
  color: string;
}

interface UpdateTagData {
  name?: string;
  color?: string;
}

interface TagsResult extends ApiResponse<Tag[]> {
  tags?: Tag[];
}

interface TagResult extends ApiResponse<Tag> {
  tag?: Tag;
}

interface ITagService {
  getTags(dashboardId: string): Promise<TagsResult>;
  createTag(dashboardId: string, data: CreateTagData): Promise<TagResult>;
  updateTag(dashboardId: string, tagId: string, data: UpdateTagData): Promise<TagResult>;
  deleteTag(dashboardId: string, tagId: string): Promise<OperationResult>;
}

import { httpService } from '@/common/http';

export class TagService implements ITagService {
  private static instance: TagService;
  
  private constructor() {}
  
  public static getInstance(): TagService {
    if (!TagService.instance) {
      TagService.instance = new TagService();
    }
    return TagService.instance;
  }

  public async getTags(dashboardId: string): Promise<TagsResult> {
    try {
      const response = await httpService.get<Tag[]>(`/api/todo/dashboards/${dashboardId}/tags`);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }
      
      return {
        success: true,
        tags: response.data as Tag[]
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleApiError(error)
      };
    }
  }

  public async createTag(dashboardId: string, data: CreateTagData): Promise<TagResult> {
    try {
      if (!this.validateTagData(data)) {
        return {
          success: false,
          error: 'Tag name and color are required'
        };
      }
      
      const response = await httpService.post<Tag>(`/api/todo/dashboards/${dashboardId}/tags`, data);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }
      
      return {
        success: true,
        tag: response.data as Tag
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleApiError(error)
      };
    }
  }

  public async updateTag(dashboardId: string, tagId: string, data: UpdateTagData): Promise<TagResult> {
    try {
      const response = await httpService.put<Tag>(`/api/todo/dashboards/${dashboardId}/tags/${tagId}`, data);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }
      
      return {
        success: true,
        tag: response.data as Tag
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleApiError(error)
      };
    }
  }

  public async deleteTag(dashboardId: string, tagId: string): Promise<OperationResult> {
    try {
      const response = await httpService.delete(`/api/todo/dashboards/${dashboardId}/tags/${tagId}`);
      
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

  private validateTagData(data: CreateTagData): boolean {
    return !!data.name?.trim() && !!data.color?.trim();
  }
  
  private handleApiError(error: unknown): string {
    return error instanceof Error ? error.message : 'An unexpected error occurred';
  }
}

export const tagService = TagService.getInstance(); 