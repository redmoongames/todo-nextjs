'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModal } from '../providers/ModalProvider';
import { ModalPosition, ModalSize } from '../types';

export function Modal(): React.ReactElement {
  const { isOpen, modalContent, modalOptions, closeModal } = useModal();

  // Handle escape key press to close modal if closeOnEscape is enabled
  useEffect(() => {
    if (!isOpen || !modalOptions.closeOnEscape) return;
    
    const handleEscapeKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, modalOptions.closeOnEscape, closeModal]);

  // Prevent body scrolling when modal is open if preventScroll is enabled
  useEffect(() => {
    if (!isOpen || !modalOptions.preventScroll) return;
    
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, modalOptions.preventScroll]);

  // Get position class based on position option
  const getPositionClass = (position: ModalPosition = 'center'): string => {
    switch (position) {
      case 'top':
        return 'top-0 left-1/2 -translate-x-1/2 mt-24';
      case 'right':
        return 'right-0 top-1/2 -translate-y-1/2 mr-24';
      case 'bottom':
        return 'bottom-0 left-1/2 -translate-x-1/2 mb-24';
      case 'left':
        return 'left-0 top-1/2 -translate-y-1/2 ml-24';
      case 'center':
      default:
        return 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2';
    }
  };

  // Get width class based on size option
  const getSizeClass = (size: ModalSize = 'md'): string => {
    switch (size) {
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      case 'full':
        return 'max-w-full mx-4';
      default:
        return 'max-w-md';
    }
  };

  const handleBackdropClick = (): void => {
    if (modalOptions.closeOnBackdropClick !== false) {
      closeModal();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: modalOptions.transitionDuration || 0.2 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: modalOptions.transitionDuration || 0.2 }}
            className={`fixed z-50 w-full ${getSizeClass(modalOptions.size)} ${getPositionClass(modalOptions.position)} ${modalOptions.className || ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
              {modalContent}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 