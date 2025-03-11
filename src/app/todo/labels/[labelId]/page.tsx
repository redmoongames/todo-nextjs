'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { IoArrowBack, IoCheckmarkCircleOutline } from 'react-icons/io5';
import Link from 'next/link';

interface Task {
  id: string;
  title: string;
  description: string;
  label: {
    name: string;
    color: string;
  };
}

const DUMMY_TASKS: { [key: string]: Task[] } = {
  'high': [
    {
      id: '1',
      title: 'Critical bug fix in production',
      description: 'Investigate and fix the authentication issue affecting production users',
      label: { name: 'High Priority', color: 'bg-red-500' }
    },
    {
      id: '2',
      title: 'Security vulnerability patch',
      description: 'Apply security patch to address recently discovered vulnerability',
      label: { name: 'High Priority', color: 'bg-red-500' }
    }
  ],
  'bug': [
    {
      id: '3',
      title: 'Fix navigation bug',
      description: 'Address the navigation issue in the mobile view',
      label: { name: 'Bug', color: 'bg-rose-500' }
    }
  ]
};

export default function LabelPage() {
  const params = useParams();
  const labelId = params.labelId as string;
  const tasks = DUMMY_TASKS[labelId] || [];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Link
          href="/dashboard/labels"
          className="text-gray-400 hover:text-white transition-colors"
        >
          <IoArrowBack size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-white">Tasks with Label: {labelId}</h1>
      </div>

      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        <div className="divide-y divide-gray-700">
          {tasks.map((task) => (
            <div key={task.id} className="p-4 flex items-start space-x-4">
              <button className="mt-1 text-gray-400 hover:text-green-400 transition-colors">
                <IoCheckmarkCircleOutline size={24} />
              </button>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-1">
                  <h3 className="font-medium text-white">{task.title}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs ${task.label.color} text-white`}>
                    {task.label.name}
                  </div>
                </div>
                <p className="text-gray-400">{task.description}</p>
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              No tasks found with this label
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 