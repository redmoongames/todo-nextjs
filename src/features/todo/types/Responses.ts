import { Dashboard, DashboardMember, Tag, Todo } from './Models';

export interface OperationResult {
  success: boolean;
  error?: string;
}

export interface DashboardResult extends OperationResult {
  dashboards?: Dashboard[];
}

export interface DashboardDetailResult extends OperationResult {
  dashboard?: Dashboard;
}

export interface DashboardOperationResult extends OperationResult {
  dashboard?: Dashboard;
}

export interface DashboardMembersResult extends OperationResult {
  members?: DashboardMember[];
}

export interface MemberOperationResult extends OperationResult {
  member?: DashboardMember;
}

export interface TodoResult extends OperationResult {
  todos?: Todo[];
}

export interface TodoDetailResult extends OperationResult {
  todo?: Todo;
}

export interface TodoOperationResult extends OperationResult {
  todo?: Todo;
}

export interface TagResult extends OperationResult {
  tags?: Tag[];
}

export interface TagOperationResult extends OperationResult {
  tag?: Tag;
} 