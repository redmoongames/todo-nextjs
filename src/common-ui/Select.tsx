import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'options'> {
  label: string;
  options: SelectOption[];
  error?: string;
}

export function Select({ label, options, error, className = '', ...props }: SelectProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-200">
        {label}
      </label>
      <select
        className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm 
          text-white
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          ${error ? 'border-red-500' : 'border-gray-600'}
          ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
} 