import { 
  Tag, 
  CreateTagData, 
  UpdateTagData 
} from '../types/Models';
import {
  TagResult,
  TagOperationResult,
  OperationResult
} from '../types/Responses';
import { ITagService } from '../types/Interfaces';
import { httpService } from '@/shared/http';
import { buildTodoEndpoint, handleApiError } from './ApiUtils';

export class TagService implements ITagService {
  private static instance: TagService;
  
  private constructor() {}
  
  public static getInstance(): TagService {
    if (!TagService.instance) {
      TagService.instance = new TagService();
    }
    return TagService.instance;
  }

  public async getTags(dashboardId: string): Promise<TagResult> {
    try {
      const response = await httpService.get<Tag[]>(buildTodoEndpoint(dashboardId, 'tags'));
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }
      
      return {
        success: true,
        tags: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  }

  public async createTag(dashboardId: string, data: CreateTagData): Promise<TagOperationResult> {
    try {
      if (!this.validateTagData(data)) {
        return {
          success: false,
          error: 'Tag name and color are required'
        };
      }
      
      const response = await httpService.post<Tag>(buildTodoEndpoint(dashboardId, 'tags'), data);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }
      
      return {
        success: true,
        tag: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  }

  public async updateTag(dashboardId: string, tagId: string, data: UpdateTagData): Promise<TagOperationResult> {
    try {
      const response = await httpService.put<Tag>(buildTodoEndpoint(dashboardId, `tags/${tagId}`), data);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }
      
      return {
        success: true,
        tag: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  }

  public async deleteTag(dashboardId: string, tagId: string): Promise<OperationResult> {
    try {
      const response = await httpService.delete(buildTodoEndpoint(dashboardId, `tags/${tagId}`));
      
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

  private validateTagData(data: CreateTagData): boolean {
    return Boolean(data.name && data.name.trim() && data.color && data.color.trim());
  }
}

export const tagService = TagService.getInstance(); 