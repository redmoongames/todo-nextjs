import React, { useState } from 'react';
import { TodoList } from './TodoList';
import { CompletedTasks } from './CompletedTasks';

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

interface CompletedTask {
  id: string;
  title: string;
  completedAt: Date;
  completedBy: {
    name: string;
    avatar: string;
  };
}

const DUMMY_TASKS: Task[] = [
  {
    id: '1',
    title: 'Design new dashboard layout',
    description: 'Create wireframes and mockups for the new admin dashboard interface. Focus on dark theme and user experience.',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    labels: [
      { id: 'high', name: 'High Priority', color: 'bg-red-500' },
      { id: 'design', name: 'Design', color: 'bg-purple-500' }
    ]
  },
  {
    id: '2',
    title: 'Implement authentication system',
    description: 'Set up JWT authentication with refresh tokens. Include social login options and proper security measures.',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
    labels: [
      { id: 'medium', name: 'Medium Priority', color: 'bg-yellow-500' },
      { id: 'feature', name: 'Feature', color: 'bg-emerald-500' }
    ]
  },
  {
    id: '3',
    title: 'Optimize database queries',
    description: 'Review and optimize current database queries. Add proper indexes and improve performance.',
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000), // 3 days ago
    labels: [
      { id: 'low', name: 'Low Priority', color: 'bg-blue-500' },
      { id: 'performance', name: 'Performance', color: 'bg-orange-500' }
    ]
  },
  {
    id: '4',
    title: 'Write API documentation',
    description: 'Document all API endpoints using OpenAPI specification. Include examples and response schemas.',
    createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000), // 4 days ago
    labels: [
      { id: 'medium', name: 'Medium Priority', color: 'bg-yellow-500' },
      { id: 'documentation', name: 'Documentation', color: 'bg-gray-500' }
    ]
  }
];

const DUMMY_COMPLETED: CompletedTask[] = [
  {
    id: '5',
    title: 'Setup development environment',
    completedAt: new Date(Date.now() - 3600000), // 1 hour ago
    completedBy: {
      name: 'You',
      avatar: 'https://ui-avatars.com/api/?name=You&background=1E1E1E&color=fff'
    }
  },
  {
    id: '6',
    title: 'Create project structure',
    completedAt: new Date(Date.now() - 7200000), // 2 hours ago
    completedBy: {
      name: 'You',
      avatar: 'https://ui-avatars.com/api/?name=You&background=1E1E1E&color=fff'
    }
  }
];

export function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>(DUMMY_TASKS);
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>(DUMMY_COMPLETED);

  const handleTaskComplete = (taskId: string) => {
    const completedTask = tasks.find(task => task.id === taskId);
    if (completedTask) {
      const newCompletedTask: CompletedTask = {
        id: completedTask.id,
        title: completedTask.title,
        completedAt: new Date(),
        completedBy: {
          name: 'You',
          avatar: 'https://ui-avatars.com/api/?name=You&background=1E1E1E&color=fff'
        }
      };

      setCompletedTasks(prev => [newCompletedTask, ...prev]);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <TodoList 
        tasks={tasks} 
        onTaskComplete={handleTaskComplete}
        onTaskDelete={handleTaskDelete}
      />
      
      <CompletedTasks 
        tasks={completedTasks} 
      />
    </div>
  );
} 