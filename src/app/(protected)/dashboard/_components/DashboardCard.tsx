'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Dashboard } from '@/features/todo-planner';
import { TaskStatistics, TaskStats } from './TaskStatistics';

export interface DashboardWithStats extends Dashboard {
  taskStats?: TaskStats;
}

interface DashboardCardProps {
  dashboard: DashboardWithStats;
  onDelete: (dashboardId: string) => Promise<void>;
}

export function DashboardCard({ dashboard, onDelete }: DashboardCardProps): React.ReactElement {
  const stats = dashboard.taskStats;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.1 } }}
      className="group border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all duration-200 bg-gradient-to-b from-gray-900 to-black"
    >
      <Link href={`/dashboard/${dashboard.id}`} className="flex items-center p-5 focus:outline-none">
        <div className="flex-grow mr-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-white group-hover:text-white truncate">
              {dashboard.title}
            </h3>
            {dashboard.is_public && (
              <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-full border border-gray-700 ml-2">
                Public
              </span>
            )}
          </div>
          
          <p className="text-gray-400 mb-3 group-hover:text-gray-300 transition-colors">
            {dashboard.description || 'No description provided'}
          </p>
          
          <div className="text-xs text-gray-500">
            Created: {new Date(dashboard.created_at).toLocaleDateString()}
          </div>
        </div>
        
        <div className="flex-shrink-0 w-64">
          {stats && <TaskStatistics stats={stats} />}
        </div>
        
        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete(dashboard.id);
          }}
          className="ml-4 flex-shrink-0 p-2 text-gray-500 hover:text-red-400 transition-colors duration-150"
        >
          Delete
        </button>
      </Link>
    </motion.div>
  );
} 