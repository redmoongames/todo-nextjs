export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export const API_ENDPOINTS = {
  TASKS: '/tasks/',
  TASK_BY_ID: (id: string) => `/tasks/${id}/`,
  LABELS: '/labels/',
  LABEL_BY_ID: (id: string) => `/labels/${id}/`,
} as const;

export const PRIORITY_OPTIONS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
} as const;

export const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=You&background=1E1E1E&color=fff'; 