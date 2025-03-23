export type DashboardRole = 'owner' | 'editor' | 'viewer';

export interface Dashboard {
  id: string;
  title: string;
  description: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  owner_id: string;
}

export interface DashboardMember {
  id: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
  role: DashboardRole;
  joined_at: string;
} 