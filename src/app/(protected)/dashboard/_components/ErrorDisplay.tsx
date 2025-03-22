'use client';

import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

export function ErrorDisplay({ message }: ErrorDisplayProps) {
  return (
    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-200 text-sm">
      {message}
    </div>
  );
} 