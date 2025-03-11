'use client';

import React, { useState } from 'react';
import { SlideMenu } from './SlideMenu';

interface SlideMenuWrapperProps {
  children: React.ReactNode;
}

export function SlideMenuWrapper({ children }: SlideMenuWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <SlideMenu isOpen={isOpen} onToggle={toggleMenu} />
      <main className="transition-transform duration-300 ease-in-out">
        <div className="p-4 md:p-6">
          <div 
            className={`max-w-6xl mx-auto transition-transform duration-300 ease-in-out transform ${
              isOpen ? 'md:translate-x-64' : 'md:translate-x-0'
            }`}
          >
            {children}
          </div>
        </div>
      </main>
    </div>
  );
} 