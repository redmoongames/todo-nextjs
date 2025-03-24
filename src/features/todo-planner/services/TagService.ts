import { 
  OperationResult,
  CreateTagInput,
  UpdateTagInput,
  TagResponse as TagResult,
  ITagService,
  TagOperationResult
} from '../types/index';

export class TagService implements ITagService {
  private static instance: TagService;
  private readonly baseUrl = '/api/todo/dashboards';
  
  private constructor() {}
  
  public static getInstance(): TagService {
    if (!TagService.instance) {
      TagService.instance = new TagService();
    }
    return TagService.instance;
  }

  private async fetch<T>(url: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  private handleApiError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error('An unexpected error occurred');
  }

  public async getTags(dashboardId: string): Promise<TagResult> {
    try {
      const response = await this.fetch<TagResult>(`${this.baseUrl}/${dashboardId}/tags`);
      return response;
    } catch (error) {
      return {
        success: false,
        error: this.handleApiError(error).message
      };
    }
  }

  public async getTagById(dashboardId: string, tagId: string): Promise<TagOperationResult> {
    try {
      const response = await this.fetch<TagOperationResult>(`${this.baseUrl}/${dashboardId}/tags/${tagId}`);
      return response;
    } catch (error) {
      return {
        success: false,
        error: this.handleApiError(error).message
      };
    }
  }

  public async createTag(dashboardId: string, data: CreateTagInput): Promise<TagOperationResult> {
    try {
      const response = await this.fetch<TagOperationResult>(`${this.baseUrl}/${dashboardId}/tags`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return response;
    } catch (error) {
      return {
        success: false,
        error: this.handleApiError(error).message
      };
    }
  }

  public async updateTag(dashboardId: string, tagId: string, data: UpdateTagInput): Promise<TagOperationResult> {
    try {
      const response = await this.fetch<TagOperationResult>(`${this.baseUrl}/${dashboardId}/tags/${tagId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      return response;
    } catch (error) {
      return {
        success: false,
        error: this.handleApiError(error).message
      };
    }
  }

  public async deleteTag(dashboardId: string, tagId: string): Promise<OperationResult> {
    try {
      const response = await this.fetch<OperationResult>(`${this.baseUrl}/${dashboardId}/tags/${tagId}`, {
        method: 'DELETE'
      });
      return response;
    } catch (error) {
      return {
        success: false,
        error: this.handleApiError(error).message
      };
    }
  }

  private validateTagData(data: CreateTagInput): boolean {
    return !!data.name?.trim();
  }
}

export const tagService = TagService.getInstance(); 