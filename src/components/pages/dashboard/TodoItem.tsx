import React, { useState } from 'react';
import { IoTrashOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Label {
  id: string;
  name: string;
  color: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  labels: Label[];
}

interface TodoItemProps {
  task: Task;
  onDelete: (taskId: string) => void;
  onComplete: (taskId: string) => void;
}

export function TodoItem({ task, onDelete, onComplete }: TodoItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/dashboard/task/${task.id}`}>
      <div
        className="p-4 relative group hover:bg-gray-700/50 transition-colors rounded-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-start space-x-4">
          {/* Complete Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onComplete(task.id);
            }}
            className="mt-1 text-gray-400 hover:text-green-400 transition-colors"
          >
            <IoCheckmarkCircleOutline size={24} />
          </button>

          {/* Task Content */}
          <div className="flex-1">
            <h3 className="font-medium text-white mb-1">{task.title}</h3>
            <p className="text-gray-400 mb-3">{task.description}</p>

            {/* Labels */}
            <div className="flex flex-wrap gap-2 mb-2">
              {task.labels.map((label) => (
                <span
                  key={label.id}
                  className={`px-2 py-1 rounded-full text-xs ${label.color} text-white`}
                >
                  {label.name}
                </span>
              ))}
            </div>

            {/* Creation Time */}
            <div className="text-sm text-gray-500">
              Created {formatDistanceToNow(task.createdAt, { addSuffix: true })}
            </div>
          </div>
        </div>

        {/* Delete Button - Appears on Hover */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(task.id);
          }}
          className={`absolute top-2 right-2 p-2 rounded-lg bg-gray-800/50 text-gray-400 
            hover:text-red-400 transition-all transform
            ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}
        >
          <IoTrashOutline size={20} />
        </button>
      </div>
    </Link>
  );
} 