'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

type SlideMenuItemAction = 
  | { type: 'navigation'; path: string }
  | { type: 'modal'; handler: () => void }
  | { type: 'action'; handler: () => void };

interface SlideMenuItemProps {
  icon: React.ReactNode;
  label: string;
  action: SlideMenuItemAction;
  isActive?: boolean;
  onToggle?: () => void; // Optional callback to close menu after action
}

export function SlideMenuItem({ 
  icon, 
  label, 
  action, 
  isActive = false,
  onToggle 
}: SlideMenuItemProps) {
  const router = useRouter();

  const handleClick = () => {
    // Execute the appropriate action based on type
    switch (action.type) {
      case 'navigation':
        router.push(action.path);
        if (onToggle) onToggle(); // Close menu after navigation
        break;
      case 'modal':
      case 'action':
        action.handler();
        // For modals, we typically don't close the menu automatically
        // as the user might want to see both the modal and menu
        break;
    }
  };

  return (
    <motion.button
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
        isActive 
          ? 'bg-white/10 text-white border border-gray-800' 
          : 'text-gray-400 hover:bg-gray-900 hover:text-white'
      }`}
    >
      <div className={`text-xl ${isActive ? 'text-white' : 'text-gray-500'}`}>
        {icon}
      </div>
      <span className="font-medium">{label}</span>
    </motion.button>
  );
} 