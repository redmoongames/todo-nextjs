'use client';

import { Task } from '@/todo';
import { formatDistanceToNow } from 'date-fns';

interface TaskDetailsModalProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export function TaskDetailsModal({ task, onComplete, onDelete }: TaskDetailsModalProps) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-gray-100">{task.title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => onComplete(task.id)}
            className="p-2 text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-red-400 hover:text-red-300 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <p className="text-gray-400 mb-6">{task.description}</p>

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
    </div>
  );
} 