'use client';

import React from 'react';
import { Dashboard } from '@/features/todo-planner/types/Models';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface DashboardListProps {
  dashboards: Dashboard[];
  onDelete: (dashboardId: string) => Promise<void>;
}

export function DashboardList({ dashboards, onDelete }: DashboardListProps): React.ReactElement {
  // Ensure dashboards is always an array
  const dashboardsArray = Array.isArray(dashboards) ? dashboards : [];
  
  if (dashboardsArray.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-800/50 rounded-lg border border-gray-700">
        <h3 className="text-xl font-medium text-gray-300">No dashboards yet</h3>
        <p className="mt-2 text-gray-400">Create your first dashboard to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dashboardsArray.map((dashboard) => (
        <motion.div
          key={dashboard.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-lg border border-gray-700/50 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col"
        >
          <div className="p-6 flex-grow">
            <h3 className="text-xl font-semibold text-white mb-2 truncate">{dashboard.title}</h3>
            <p className="text-gray-400 mb-4 line-clamp-2 h-12">
              {dashboard.description || 'No description provided'}
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <span>Created: {new Date(dashboard.created_at).toLocaleDateString()}</span>
              {dashboard.is_public && (
                <span className="ml-2 px-2 py-1 bg-blue-900/50 text-blue-300 rounded-full text-xs">
                  Public
                </span>
              )}
            </div>
          </div>
          <div className="bg-gray-700/30 p-4 flex justify-between">
            <Link
              href={`/dashboard/${dashboard.id}`}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors duration-300"
            >
              Open
            </Link>
            <button
              onClick={() => onDelete(dashboard.id)}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-300 text-sm font-medium rounded transition-colors duration-300"
            >
              Delete
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 