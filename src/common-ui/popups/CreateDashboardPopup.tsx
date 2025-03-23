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
        className="px-4 py-2 border border-gray-800 rounded-md text-gray-200 hover:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button
        type="submit"
        form="create-dashboard-form"
        className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400"
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
          <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-md text-red-300 text-sm">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-black border border-gray-800 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 text-white"
            placeholder="Dashboard title"
            disabled={isSubmitting}
            autoFocus
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-black border border-gray-800 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 text-white min-h-[100px]"
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
              className="h-4 w-4 border-gray-800 bg-black rounded focus:ring-gray-400"
              disabled={isSubmitting}
            />
            <label htmlFor="is_public" className="ml-2 block text-sm text-gray-200">
              Make this dashboard public
            </label>
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
} 