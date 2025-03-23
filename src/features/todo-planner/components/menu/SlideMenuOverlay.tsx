'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface SlideMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SlideMenuOverlay({ isOpen, onClose }: SlideMenuOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
        />
      )}
    </AnimatePresence>
  );
} 