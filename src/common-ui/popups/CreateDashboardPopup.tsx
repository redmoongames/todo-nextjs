'use client';

import React, { useState } from 'react';
import { ModalWrapper } from '@/features/modal';
import { CreateDashboardData } from '@/features/todo-planner';

interface CreateDashboardPopupProps {
  onSubmit: (data: CreateDashboardData) => Promise<void>;
  onCancel: () => void;
}

export function CreateDashboardPopup({ onSubmit, onCancel }: CreateDashboardPopupProps): React.ReactElement {
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

  const footer = (
    <>
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button
        type="submit"
        form="create-dashboard-form"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating...' : 'Create Dashboard'}
      </button>
    </>
  );

  return (
    <ModalWrapper title="Create New Dashboard" footer={footer}>
      <form id="create-dashboard-form" onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-800 rounded-md text-red-300 text-sm">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
            placeholder="Dashboard title"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 min-h-[100px]"
            placeholder="Dashboard description (optional)"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="mb-6">
          <div className="flex items-center">
            <input
              id="is_public"
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-600 bg-gray-700 rounded focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <label htmlFor="is_public" className="ml-2 block text-sm text-gray-300">
              Make this dashboard public
            </label>
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
} 