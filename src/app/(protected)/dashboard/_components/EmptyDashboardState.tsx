'use client';

import React from 'react';

interface EmptyDashboardStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
}

export function EmptyDashboardState({
  title = 'No dashboards yet',
  message = 'Create your first dashboard to organize your tasks and boost productivity.',
  actionLabel = 'Click "New Dashboard" to get started'
}: EmptyDashboardStateProps): React.ReactElement {
  return (
    <div className="border border-gray-800 rounded-lg p-16 text-center bg-gradient-to-b from-gray-900 to-black">
      <h3 className="text-2xl font-medium text-white mb-4">{title}</h3>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        {message}
      </p>
      <div className="inline-block border-b border-gray-800 pb-1 text-gray-400 hover:text-white hover:border-gray-500 transition-colors duration-200 cursor-pointer">
        {actionLabel}
      </div>
    </div>
  );
} 