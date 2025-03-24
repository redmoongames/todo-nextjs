import { Dashboard, DashboardMember } from '../core/DashboardTypes';
import { Tag, Todo } from '../core/TodoTypes';
import { BaseResponse } from '../index';

export interface TodoResponse extends BaseResponse {
  todo?: Todo;
}

export interface TodosResponse extends BaseResponse {
  todos?: Todo[];
}

export interface TagResponse extends BaseResponse {
  tag?: Tag;
}

export interface TagsResponse extends BaseResponse {
  tags?: Tag[];
}

export interface DashboardResponse extends BaseResponse {
  dashboard?: Dashboard;
}

export interface DashboardsResponse extends BaseResponse {
  dashboards?: Dashboard[];
}

export interface MemberResponse extends BaseResponse {
  member?: DashboardMember;
}

export interface MembersResponse extends BaseResponse {
  members?: DashboardMember[];
} 