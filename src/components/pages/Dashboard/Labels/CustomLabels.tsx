import React, { useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import { LabelCard } from './LabelCard';
import { CreateLabelForm } from './CreateLabelForm';

interface Label {
  id: string;
  name: string;
  color: string;
  tasksCount: number;
}

interface CustomLabelsProps {
  labels: Label[];
  onCreateLabel: (name: string, color: string) => void;
}

export function CustomLabels({ labels, onCreateLabel }: CustomLabelsProps) {
  const [isCreating, setIsCreating] = useState(false);

  return (
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
        <CreateLabelForm
          onSubmit={(name, color) => {
            onCreateLabel(name, color);
            setIsCreating(false);
          }}
          onCancel={() => setIsCreating(false)}
        />
      )}

      <div className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {labels.map((label) => (
          <LabelCard key={label.id} label={label} />
        ))}
      </div>
    </div>
  );
} 