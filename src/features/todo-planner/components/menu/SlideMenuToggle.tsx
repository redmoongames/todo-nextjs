'use client';

import { motion } from 'framer-motion';

interface SlideMenuToggleProps {
  isMenuOpen: boolean;
  onToggle: () => void;
}

export function SlideMenuToggle({ isMenuOpen, onToggle }: SlideMenuToggleProps) {
  return (
    <>
      {/* Main toggle button that slides with menu */}
      <motion.button
        initial={false}
        animate={{
          x: isMenuOpen ? 256 : 0,
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30
          }
        }}
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-black text-white border border-gray-800 hover:border-gray-700 transition-colors shadow-md"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
          />
        </svg>
      </motion.button>

      {/* Toggle button inside menu */}
      <motion.button
        initial={false}
        animate={{
          opacity: isMenuOpen ? 1 : 0,
          transition: {
            duration: 0.2,
            delay: isMenuOpen ? 0.1 : 0
          }
        }}
        onClick={onToggle}
        className="fixed top-4 right-4 z-50 p-2 rounded-md bg-black text-white border border-gray-800 hover:border-gray-700 transition-colors shadow-md"
        aria-label="Close menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </motion.button>
    </>
  );
} 