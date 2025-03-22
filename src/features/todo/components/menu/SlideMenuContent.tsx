'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthState } from '@/features/auth';
import { SlideMenuItem } from './SlideMenuItem';
import { useModal } from '@/shared/components/modal';
import { AddTaskModal } from '@/shared/components/modal/modals';

interface SlideMenuContentProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function SlideMenuContent({ isOpen, onToggle }: SlideMenuContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuthState();
  const { openModal } = useModal();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const openSettingsModal = () => {
    openModal(
      <div className="p-6 bg-gray-800 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Settings</h3>
        <p className="text-gray-300">Settings content would go here.</p>
      </div>
    );
  };

  const openAddTaskModal = () => {
    openModal(
      <AddTaskModal 
        onClose={() => openModal(null)} 
        onSuccess={() => {
          // Refresh the task list or show a success message
          router.refresh();
        }} 
      />
    );
  };

  return (
    <motion.div
      initial={false}
      animate={{
        x: isOpen ? 0 : '-100%',
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 30
        }
      }}
      className="fixed top-0 left-0 h-full w-64 bg-gray-800 shadow-lg z-40"
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Menu</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <SlideMenuItem 
            icon={<i className="fas fa-tasks"></i>}
            label="My Tasks"
            action={{ type: 'navigation', path: '/dashboard' }}
            isActive={pathname === '/dashboard'}
            onToggle={onToggle}
          />
          
          <SlideMenuItem 
            icon={<i className="fas fa-plus-circle"></i>}
            label="Add Task"
            action={{ type: 'modal', handler: openAddTaskModal }}
          />
          
          <SlideMenuItem 
            icon={<i className="fas fa-tag"></i>}
            label="Labels"
            action={{ type: 'navigation', path: '/dashboard/labels' }}
            isActive={pathname === '/dashboard/labels'}
            onToggle={onToggle}
          />
          
          <SlideMenuItem 
            icon={<i className="fas fa-cog"></i>}
            label="Settings"
            action={{ type: 'modal', handler: openSettingsModal }}
          />
        </nav>
        <div className="p-4 border-t border-gray-700">
          <SlideMenuItem 
            icon={<i className="fas fa-sign-out-alt"></i>}
            label="Logout"
            action={{ type: 'action', handler: handleLogout }}
          />
        </div>
      </div>
    </motion.div>
  );
} 