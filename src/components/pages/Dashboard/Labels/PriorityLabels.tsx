import React from 'react';
import Link from 'next/link';
import { LabelCard } from './LabelCard';

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

export function PriorityLabels() {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white">Priority Labels</h2>
      </div>
      <div className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {PRIORITY_LABELS.map((label) => (
          <LabelCard key={label.id} label={label} />
        ))}
      </div>
    </div>
  );
} 