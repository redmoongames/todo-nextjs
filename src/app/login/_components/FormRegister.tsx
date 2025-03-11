'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InputField } from './InputField';

interface RegisterFormProps {
  onSubmit: (username: string, password: string) => void;
  error?: string;
  disabled?: boolean;
}

export function FormRegister({ onSubmit, error, disabled }: RegisterFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(username, password);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits 1-5 and limit to 5 characters
    // Also allow empty string for user to enter
    if (value === '' || (/^[1-5]{0,5}$/).test(value)) {
      setPassword(value);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="mt-8 space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-400 text-sm text-center bg-red-500/10 p-3 rounded-lg border border-red-500/20"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="space-y-4">
        <InputField
          id="username"
          type="text"
          header="Username"
          fieldHint="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={disabled}
        />
        
        <InputField
          id="password"
          type="text"
          header="Password"
          fieldHint="Must be 5 digits. Only digits from 1 to 5"
          value={password}
          onChange={handlePasswordChange}
          disabled={disabled}
        />
        <p className="mt-2 text-sm text-gray-400">
          All passwords are hashed using salt and pepper! <br />Terekhov Alex approves this message.
        </p>
      </div>

      <motion.button
        type="submit"
        disabled={disabled || password.length !== 5}
        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Create Account
      </motion.button>
    </motion.form>
  );
} 