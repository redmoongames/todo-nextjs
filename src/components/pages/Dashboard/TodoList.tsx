'use client';

import React, { useState } from 'react';
import { TodoItem } from './TodoItem';

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

interface TodoListProps {
  tasks: Task[];
  onTaskComplete: (taskId: string) => void;
  onTaskDelete: (taskId: string) => void;
}

export function TodoList({ tasks, onTaskComplete, onTaskDelete }: TodoListProps) {
  const [dissolvingTasks, setDissolvingTasks] = useState<string[]>([]);

  const handleTaskComplete = async (taskId: string) => {
    // Start dissolution animation
    setDissolvingTasks((prev) => [...prev, taskId]);

    // Wait for animation to complete before actually removing the task
    setTimeout(() => {
      onTaskComplete(taskId);
      setDissolvingTasks((prev) => prev.filter(id => id !== taskId));
    }, 1000);
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white">All Tasks</h2>
      </div>
      <div className="divide-y divide-gray-700">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`transition-all duration-1000
              ${dissolvingTasks.includes(task.id) 
                ? 'opacity-0 transform translate-x-full' 
                : 'opacity-100 transform translate-x-0'}`}
          >
            <TodoItem
              task={task}
              onComplete={handleTaskComplete}
              onDelete={onTaskDelete}
            />
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            No tasks to show
          </div>
        )}
      </div>
    </div>
  );
} 