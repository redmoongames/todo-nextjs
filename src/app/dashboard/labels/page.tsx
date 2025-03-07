'use client';

import React, { useState } from 'react';
import { PriorityLabelsSection } from '@/components/pages/labels/PriorityLabelsSection';
import { CustomLabelsSection } from '@/components/pages/labels/CustomLabelsSection';
import { Label } from '@/components/pages/labels/types/Label';

const PRIORITY_LABELS: Label[] = [
  { id: 'high', name: 'High Priority', color: 'bg-red-500', tasksCount: 3 },
  { id: 'medium', name: 'Medium Priority', color: 'bg-yellow-500', tasksCount: 5 },
  { id: 'low', name: 'Low Priority', color: 'bg-blue-500', tasksCount: 2 }
];

const INITIAL_CUSTOM_LABELS: Label[] = [
  { id: 'bug', name: 'Bug', color: 'bg-rose-500', tasksCount: 4 },
  { id: 'feature', name: 'Feature', color: 'bg-emerald-500', tasksCount: 2 },
  { id: 'documentation', name: 'Documentation', color: 'bg-purple-500', tasksCount: 1 }
];

export default function LabelsPage() {
  const [customLabels, setCustomLabels] = useState<Label[]>(INITIAL_CUSTOM_LABELS);

  const handleCreateLabel = (labelData: Omit<Label, 'id' | 'tasksCount'>) => {
    const newLabel: Label = {
      ...labelData,
      id: Date.now().toString(),
      tasksCount: 0
    };
    setCustomLabels(prev => [...prev, newLabel]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <PriorityLabelsSection labels={PRIORITY_LABELS} />
      <CustomLabelsSection labels={customLabels} onCreateLabel={handleCreateLabel} />
    </div>
  );
} 