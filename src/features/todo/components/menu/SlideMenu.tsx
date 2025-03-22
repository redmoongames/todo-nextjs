'use client';

import { useState, useEffect } from 'react';
import { SlideMenuContent } from './SlideMenuContent';
import { SlideMenuOverlay } from './SlideMenuOverlay';
import { SlideMenuToggle } from './SlideMenuToggle';

interface SlideMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function SlideMenu({ isOpen, onToggle }: SlideMenuProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      <SlideMenuOverlay isOpen={isOpen && isMobile} onClose={onToggle} />
      <SlideMenuContent isOpen={isOpen} onToggle={onToggle} />
      <SlideMenuToggle isMenuOpen={isOpen} onToggle={onToggle} />
    </>
  );
} 