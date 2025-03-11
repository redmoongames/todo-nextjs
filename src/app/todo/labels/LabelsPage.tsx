'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PriorityLabelsSection } from './PriorityLabelsSection';
import { CustomLabelsSection } from './CustomLabelsSection';
import { Label } from './types/Label';
import { AuthWrapper } from '@/auth';

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

export function LabelsPage() {
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
    <AuthWrapper>
      <div className="min-h-screen bg-gray-900 py-6 flex flex-col justify-center sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-200"
              >
                Labels
              </motion.h1>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 p-6"
              >
                <PriorityLabelsSection labels={PRIORITY_LABELS} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 p-6"
              >
                <CustomLabelsSection labels={customLabels} onCreateLabel={handleCreateLabel} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </AuthWrapper>
  );
} 