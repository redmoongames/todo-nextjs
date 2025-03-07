import React, { useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import { Label } from './types/Label';
import { LabelCard } from './LabelCard';
import { CreateLabelForm } from './CreateLabelForm';

interface CustomLabelsSectionProps {
  labels: Label[];
  onCreateLabel: (label: Omit<Label, 'id' | 'tasksCount'>) => void;
}

export function CustomLabelsSection({ labels, onCreateLabel }: CustomLabelsSectionProps) {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateLabel = (labelData: Omit<Label, 'id' | 'tasksCount'>) => {
    onCreateLabel(labelData);
    setIsCreating(false);
  };

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
          onSubmit={handleCreateLabel}
          onCancel={() => setIsCreating(false)}
        />
      )}

      <div className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {labels.map((label) => (
          <LabelCard key={label.id} label={label} />
        ))}
        {labels.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-8">
            No custom labels yet
          </div>
        )}
      </div>
    </div>
  );
} 