import React from 'react';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { formatDistanceToNow } from 'date-fns';

interface CompletedTask {
  id: string;
  title: string;
  completedAt: Date;
  completedBy: {
    name: string;
    avatar: string;
  };
}

interface CompletedTasksProps {
  tasks: CompletedTask[];
}

export function CompletedTasks({ tasks }: CompletedTasksProps) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white">Completed Tasks</h2>
      </div>
      <div className="divide-y divide-gray-700">
        {tasks.map((task) => (
          <div key={task.id} className="p-4 flex items-start space-x-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700">
                <img 
                  src={task.completedBy.avatar} 
                  alt={task.completedBy.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -right-1 -bottom-1 bg-gray-800 rounded-full p-0.5">
                <IoCheckmarkCircle className="w-5 h-5 text-green-400" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-white">
                  Completed by {task.completedBy.name}: {task.title}
                </h3>
                <span className="text-sm text-gray-400 ml-4">
                  {formatDistanceToNow(task.completedAt, { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            No completed tasks yet
          </div>
        )}
      </div>
    </div>
  );
} 