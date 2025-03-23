'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { ModalContextType, ModalOptions } from '../types';

// Default modal options
const defaultModalOptions: ModalOptions = {
  size: 'md',
  position: 'center',
  closeOnEscape: true,
  closeOnBackdropClick: true,
  preventScroll: true,
  showCloseButton: true,
  transitionDuration: 0.2
};

const ModalContext = createContext<ModalContextType | null>(null);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const [modalOptions, setModalOptions] = useState<ModalOptions>(defaultModalOptions);

  const contextValue = useMemo(() => {
    const openModal = (content: ReactNode, options?: ModalOptions) => {
      setModalContent(content);
      setModalOptions({ ...defaultModalOptions, ...options });
      setIsOpen(true);
    };

    const closeModal = () => {
      setIsOpen(false);
      // Clear content after animation finishes
      setTimeout(() => {
        setModalContent(null);
        setModalOptions(defaultModalOptions);
      }, (modalOptions.transitionDuration || 0.2) * 1000 + 50);
    };

    return {
      isOpen,
      modalContent,
      modalOptions,
      openModal,
      closeModal
    };
  }, [isOpen, modalContent, modalOptions]);

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
} 