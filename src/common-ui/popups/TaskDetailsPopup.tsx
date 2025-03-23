'use client';

import React from 'react';
import { ModalWrapper } from '@/features/modal';
import { Task } from '@/features/todo-planner';
import { formatDistanceToNow } from 'date-fns';

interface TaskDetailsPopupProps {
  task: Task;
  onClose: () => void;
  onComplete?: (taskId: string) => Promise<void>;
  onDelete?: (taskId: string) => Promise<void>;
}

export function TaskDetailsPopup({ task, onComplete, onDelete, onClose }: TaskDetailsPopupProps) {
  const handleComplete = async () => {
    if (onComplete) {
      await onComplete(String(task.id));
      onClose();
    }
  };
  
  const handleDelete = async () => {
    if (onDelete) {
      await onDelete(String(task.id));
      onClose();
    }
  };
  
  // Helper to determine priority class
  const getPriorityClass = (priority: number): string => {
    switch (priority) {
      case 1:
        return 'bg-red-500/20 text-red-300';
      case 2:
        return 'bg-yellow-500/20 text-yellow-300';
      case 3:
        return 'bg-blue-500/20 text-blue-300';
      case 4:
        return 'bg-green-500/20 text-green-300';
      case 5:
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };
  
  return (
    <ModalWrapper title={task.title} onClose={onClose}>
      <div className="mb-4">
        <p className="text-gray-300">{task.description || 'No description provided'}</p>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center text-sm text-gray-400">
          <span className="mr-2">Priority:</span>
          <span className={getPriorityClass(task.priority)}>
            {task.priority || 'Low'}
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {task.tags && task.tags.map((tag: {id: string; name: string; color: string}) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 mb-2"
                style={{
                  backgroundColor: tag.color ? `${tag.color}40` : '#9CA3AF40',
                  color: tag.color || '#9CA3AF'
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-2">Created</h3>
          <p className="text-gray-400">
            {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 mt-6">
        {task.status !== 'completed' && onComplete && (
          <button
            onClick={handleComplete}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Complete
          </button>
        )}
        
        {onDelete && (
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </ModalWrapper>
  );
} 