'use client';

import { motion } from 'framer-motion';

interface LoginInputProps {
  id: string;
  type: string;
  header: string;
  fieldHint: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export function InputField({
  id,
  type,
  header = "",
  fieldHint = "",
  value,
  onChange,
  disabled,
}: LoginInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative mb-4"
    >
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-300 mb-1"
      >
        {header}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        placeholder={fieldHint}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </motion.div>
  );
} 