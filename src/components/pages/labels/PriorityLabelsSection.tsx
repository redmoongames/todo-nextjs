import React from 'react';
import Link from 'next/link';
import { Label } from './types/Label';

interface PriorityLabelsSectionProps {
  labels: Label[];
}

export function PriorityLabelsSection({ labels }: PriorityLabelsSectionProps) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white">Priority Labels</h2>
      </div>
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
  );
} 