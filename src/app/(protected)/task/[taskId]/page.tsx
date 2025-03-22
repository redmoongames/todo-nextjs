'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { IoArrowBack, IoTrashOutline, IoCheckmarkCircle, IoAdd } from 'react-icons/io5';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Label {
  id: string;
  name: string;
  color: string;
}

// Dummy data for demonstration
const AVAILABLE_LABELS: Label[] = [
  { id: 'high', name: 'High Priority', color: 'bg-red-500' },
  { id: 'medium', name: 'Medium Priority', color: 'bg-yellow-500' },
  { id: 'low', name: 'Low Priority', color: 'bg-blue-500' },
  { id: 'bug', name: 'Bug', color: 'bg-rose-500' },
  { id: 'feature', name: 'Feature', color: 'bg-emerald-500' },
  { id: 'documentation', name: 'Documentation', color: 'bg-purple-500' },
];

const DUMMY_TASK = {
  id: '1',
  title: 'Implement dark theme',
  description: 'Create and implement dark theme across all components. Ensure proper contrast and accessibility.',
  createdAt: new Date(Date.now() - 86400000), // 1 day ago
  labels: [
    { id: 'high', name: 'High Priority', color: 'bg-red-500' },
    { id: 'feature', name: 'Feature', color: 'bg-emerald-500' },
  ]
};

export default function TaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.taskId as string;

  const [task, setTask] = useState(DUMMY_TASK);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isAddingLabel, setIsAddingLabel] = useState(false);

  // Simulate fetching task data based on taskId
  useEffect(() => {
    console.log(`Fetching task data for taskId: ${taskId}`);
    // In a real app, we would fetch the task data from an API
    // For now, we're using dummy data
  }, [taskId]);

  const handleTitleChange = (newTitle: string) => {
    setTask(prev => ({ ...prev, title: newTitle }));
    setIsEditingTitle(false);
    // TODO: Save to backend
  };

  const handleDescriptionChange = (newDescription: string) => {
    setTask(prev => ({ ...prev, description: newDescription }));
    setIsEditingDescription(false);
    // TODO: Save to backend
  };

  const handleAddLabel = (label: Label) => {
    if (!task.labels.find(l => l.id === label.id)) {
      setTask(prev => ({
        ...prev,
        labels: [...prev.labels, label]
      }));
    }
    setIsAddingLabel(false);
    // TODO: Save to backend
  };

  const handleRemoveLabel = (labelId: string) => {
    setTask(prev => ({
      ...prev,
      labels: prev.labels.filter(l => l.id !== labelId)
    }));
    // TODO: Save to backend
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    router.push('/dashboard');
  };

  const handleComplete = () => {
    // TODO: Implement complete functionality
    router.push('/dashboard');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <IoArrowBack size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-white">Task Details</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
          >
            <IoTrashOutline size={24} />
          </button>
          <button
            onClick={handleComplete}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <IoCheckmarkCircle size={20} />
            <span>Complete Task</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 space-y-6">
        {/* Title */}
        <div>
          {isEditingTitle ? (
            <input
              type="text"
              value={task.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xl font-medium"
              autoFocus
            />
          ) : (
            <h2 
              className="text-xl font-medium text-white cursor-pointer hover:bg-gray-700/50 p-2 rounded-lg"
              onClick={() => setIsEditingTitle(true)}
            >
              {task.title}
            </h2>
          )}
        </div>

        {/* Description */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
          {isEditingDescription ? (
            <textarea
              value={task.description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              onBlur={() => setIsEditingDescription(false)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
              autoFocus
            />
          ) : (
            <p 
              className="text-gray-300 cursor-pointer hover:bg-gray-700/50 p-2 rounded-lg"
              onClick={() => setIsEditingDescription(true)}
            >
              {task.description}
            </p>
          )}
        </div>

        {/* Labels */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Labels</h3>
            <button
              onClick={() => setIsAddingLabel(true)}
              className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center space-x-1"
            >
              <IoAdd size={16} />
              <span>Add Label</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {task.labels.map((label) => (
              <span
                key={label.id}
                className={`px-2 py-1 rounded-full text-xs ${label.color} text-white flex items-center space-x-1`}
              >
                <span>{label.name}</span>
                <button
                  onClick={() => handleRemoveLabel(label.id)}
                  className="ml-1 hover:text-gray-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          {isAddingLabel && (
            <div className="mt-2 p-2 bg-gray-700 rounded-lg">
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_LABELS.filter(label => !task.labels.find(l => l.id === label.id)).map((label) => (
                  <button
                    key={label.id}
                    onClick={() => handleAddLabel(label)}
                    className={`px-2 py-1 rounded-lg text-sm ${label.color} text-white hover:opacity-90`}
                  >
                    {label.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Creation Time */}
        <div className="text-sm text-gray-500">
          Created {formatDistanceToNow(task.createdAt, { addSuffix: true })}
        </div>
      </div>
    </div>
  );
} 