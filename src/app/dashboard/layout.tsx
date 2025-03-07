'use client';

import { useState } from 'react';
import { MobileOverlay } from '@/components/pages/dashboard/layout/MobileOverlay';
import { MenuContainer } from '@/components/pages/dashboard/layout/MenuContainer';
import { MenuToggleButton } from '@/components/pages/dashboard/layout/MenuToggleButton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <MobileOverlay isOpen={isMenuOpen} onClose={toggleMenu} />
      <MenuContainer isOpen={isMenuOpen} onToggle={toggleMenu} />
      <MenuToggleButton isMenuOpen={isMenuOpen} onToggle={toggleMenu} />

      {/* Main Content */}
      <main className={`
        relative z-10
        transition-all duration-300 ease-in-out pt-16
        ${isMenuOpen ? 'sm:pl-64' : 'pl-0'}
      `}>
        <div className="p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
