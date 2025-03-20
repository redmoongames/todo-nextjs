'use client';

import React from 'react';
import { useModal } from '../ModalProvider';
import { Task } from '@/shared/todo/types';
import { formatDistanceToNow } from 'date-fns';

interface TaskDetailsModalProps {
  task: Task;
  onComplete?: (taskId: string) => Promise<void>;
  onDelete?: (taskId: string) => Promise<void>;
}

export function TaskDetailsModal({ task, onComplete, onDelete }: TaskDetailsModalProps) {
  const { closeModal } = useModal();
  
  const handleComplete = async () => {
    if (onComplete) {
      await onComplete(task.id);
      closeModal();
    }
  };
  
  const handleDelete = async () => {
    if (onDelete) {
      await onDelete(task.id);
      closeModal();
    }
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold">{task.title}</h2>
        <button
          onClick={closeModal}
          className="text-gray-400 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-300">{task.description || 'No description provided'}</p>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center text-sm text-gray-400">
          <span className="mr-2">Priority:</span>
          <span className={`px-2 py-1 rounded text-xs ${
            task.priority === 'high' ? 'bg-red-500/20 text-red-300' :
            task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
            'bg-blue-500/20 text-blue-300'
          }`}>
            {task.priority || 'Low'}
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-2">Labels</h3>
          <div className="flex flex-wrap gap-2">
            {task.labels && task.labels.map((label) => (
              <span
                key={label.id}
                className={`px-2 py-1 text-xs font-medium rounded-full ${label.color} text-white`}
              >
                {label.name}
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
        {!task.completed && onComplete && (
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
        
        <button
          onClick={closeModal}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
} 