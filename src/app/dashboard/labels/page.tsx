'use client';

import React, { useState } from 'react';
import { IoAdd, IoBookmark } from 'react-icons/io5';
import Link from 'next/link';

interface Label {
  id: string;
  name: string;
  color: string;
  tasksCount: number;
}

const PRIORITY_LABELS: Label[] = [
  { id: 'high', name: 'High Priority', color: 'bg-red-500', tasksCount: 3 },
  { id: 'medium', name: 'Medium Priority', color: 'bg-yellow-500', tasksCount: 5 },
  { id: 'low', name: 'Low Priority', color: 'bg-blue-500', tasksCount: 2 }
];

const DUMMY_LABELS: Label[] = [
  { id: 'bug', name: 'Bug', color: 'bg-rose-500', tasksCount: 4 },
  { id: 'feature', name: 'Feature', color: 'bg-emerald-500', tasksCount: 2 },
  { id: 'documentation', name: 'Documentation', color: 'bg-purple-500', tasksCount: 1 }
];

export default function LabelsPage() {
  const [labels, setLabels] = useState<Label[]>(DUMMY_LABELS);
  const [isCreating, setIsCreating] = useState(false);
  const [newLabelName, setNewLabelName] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-blue-500');

  const COLORS = [
    'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500',
    'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'
  ];

  const handleCreateLabel = () => {
    if (newLabelName.trim()) {
      const newLabel: Label = {
        id: Date.now().toString(),
        name: newLabelName,
        color: selectedColor,
        tasksCount: 0
      };
      setLabels(prev => [...prev, newLabel]);
      setNewLabelName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Priority Labels Section */}
      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Priority Labels</h2>
        </div>
        <div className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {PRIORITY_LABELS.map((label) => (
            <Link
              key={label.id}
              href={`/dashboard/labels/${label.id}`}
              className="block p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${label.color}`} />
                <span className="text-white font-medium">{label.name}</span>
              </div>
              <div className="mt-2 text-sm text-gray-400">
                {label.tasksCount} tasks
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Custom Labels Section */}
      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Custom Labels</h2>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <IoAdd size={20} />
            <span>Create Label</span>
          </button>
        </div>
        
        {isCreating && (
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Label Name
                </label>
                <input
                  type="text"
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter label name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Color
                </label>
                <div className="flex space-x-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      className={`w-6 h-6 rounded-full ${color} ${
                        selectedColor === color ? 'ring-2 ring-white' : ''
                      }`}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={handleCreateLabel}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        )}

        <div className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {labels.map((label) => (
            <Link
              key={label.id}
              href={`/dashboard/labels/${label.id}`}
              className="block p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${label.color}`} />
                <span className="text-white font-medium">{label.name}</span>
              </div>
              <div className="mt-2 text-sm text-gray-400">
                {label.tasksCount} tasks
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 