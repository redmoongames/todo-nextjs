import React, { useState } from 'react';
import { Label } from './types/Label';

interface CreateLabelFormProps {
  onSubmit: (label: Omit<Label, 'id' | 'tasksCount'>) => void;
  onCancel: () => void;
}

// Available color options for label customization
const COLORS = [
  'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500',
  'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'
];

export function CreateLabelForm({ onSubmit, onCancel }: CreateLabelFormProps) {
  // State management for form inputs
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({
        name: name.trim(),
        color: selectedColor
      });
      setName('');
      setSelectedColor(COLORS[0]);
    }
  };

  return (
    <div className="p-4 border-b border-gray-700">
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row lg:items-end space-y-4 lg:space-y-0 lg:space-x-4">
        
        {/* Label Name Input Section */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Label Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter label name"
          />
        </div>

        {/* Color Selection Section */}
        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Color
          </label>
          <div className="flex space-x-2">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`w-6 h-6 rounded-full ${color} ${
                  selectedColor === color ? 'ring-2 ring-white' : ''
                }`}
                onClick={() => setSelectedColor(color)}
                aria-label={`Select ${color.replace('bg-', '').replace('-500', '')} color`}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="flex space-x-2 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
} 