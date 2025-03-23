export type TodoPriority = 1 | 2 | 3 | 4 | 5;
export type TodoStatus = 'pending' | 'completed';
export type SortOrder = 'asc' | 'desc';
export type SortField = 'created_at' | 'priority' | 'due_date';

export interface Todo {
  id: string | number;
  title: string;
  description: string;
  priority: TodoPriority;
  status: TodoStatus;
  due_date: string | null | undefined;
  created_at: string;
  updated_at?: string;
  completed_at?: string;
  dashboard_id: string;
  tags: Tag[];
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  dashboard_id: string;
}

export const PRIORITY_OPTIONS: { value: TodoPriority; label: string }[] = [
  { value: 1, label: 'Very Low' },
  { value: 2, label: 'Low' },
  { value: 3, label: 'Medium' },
  { value: 4, label: 'High' },
  { value: 5, label: 'Very High' }
];

export interface TodoFilterOptions {
  status?: TodoStatus;
  priority?: TodoPriority;
  tags?: string[];
  sort?: SortField;
  order?: SortOrder;
  query?: string;
} 