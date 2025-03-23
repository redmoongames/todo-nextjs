'use client';

import React from 'react';

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
}

interface TaskStatisticsProps {
  stats: TaskStats;
}

export function TaskStatistics({ stats }: TaskStatisticsProps): React.ReactElement | null {
  const completionPercentage = stats.total > 0 
    ? (stats.completed / stats.total) * 100 
    : 0;

  if (stats.total === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex space-x-3">
          <div className="flex items-center">
            <span className="text-white font-medium">{stats.total}</span>
            <span className="text-gray-500 text-xs ml-1">Total</span>
          </div>
          
          <div className="flex items-center">
            <span className="text-green-400 font-medium">{stats.completed}</span>
            <span className="text-gray-500 text-xs ml-1">Done</span>
          </div>
          
          <div className="flex items-center">
            <span className="text-yellow-400 font-medium">{stats.pending}</span>
            <span className="text-gray-500 text-xs ml-1">Pending</span>
          </div>
        </div>
        
        <span className="text-xs text-gray-400">{Math.round(completionPercentage)}%</span>
      </div>
      
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-green-500 to-green-400"
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>
    </div>
  );
} 