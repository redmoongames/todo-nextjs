'use client';

import { motion } from 'framer-motion';

interface LoginButtonProps {
  isRegistering: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export function LoginOrRegisterButton({ isRegistering, onClick, disabled }: LoginButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      onClick={onClick}
      disabled={disabled}
      className="text-md text-center text-indigo-400 hover:text-indigo-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isRegistering
        ? 'Already have an account? Sign in'
        : "Don't have an account? Register"}
    </motion.button>
  );
} 