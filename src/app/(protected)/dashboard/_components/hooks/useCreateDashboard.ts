import { useState } from 'react';
import { CreateDashboardData } from '@/features/todo-planner';

type SubmitHandler = (data: CreateDashboardData) => Promise<void>;

interface UseCreateDashboardReturn {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
  isSubmitting: boolean;
  error: string | null;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function useCreateDashboard(onSubmit: SubmitHandler): UseCreateDashboardReturn {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      const dashboardData: CreateDashboardData = {
        title: title.trim(),
        description: description.trim() || undefined,
        is_public: isPublic
      };
      
      await onSubmit(dashboardData);
    } catch {
      setError('Failed to create dashboard. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    isPublic,
    setIsPublic,
    isSubmitting,
    error,
    handleSubmit
  };
} 