import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-200">
        {label}
      </label>
      <input
        className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm 
          text-white placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          ${error ? 'border-red-500' : 'border-gray-600'}
          ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
} 