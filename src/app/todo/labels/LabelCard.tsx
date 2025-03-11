import React from 'react';
import Link from 'next/link';
import { Label } from './types/Label';

interface LabelCardProps {
  label: Label;
}

export function LabelCard({ label }: LabelCardProps) {
  return (
    <Link
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
  );
} 