'use client';

import React from 'react';

type SpinnerSize = 'small' | 'medium' | 'large';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  className?: string;
  text?: string;
}

export function LoadingSpinner({ 
  size = 'medium', 
  className = '',
  text
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-2',
    large: 'w-12 h-12 border-3',
  };
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div 
        className={`${sizeClasses[size]} rounded-full border-r-transparent border-indigo-600 animate-spin`}
      />
      {text && (
        <p className="mt-4 text-sm text-gray-300">
          {text}
        </p>
      )}
    </div>
  );
} 