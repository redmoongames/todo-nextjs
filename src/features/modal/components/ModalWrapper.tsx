'use client';

import React from 'react';
import { ModalWrapperProps } from '../types';
import { useModal } from '../providers/ModalProvider';

export function ModalWrapper({
  title,
  onClose,
  footer,
  children,
  showCloseButton = true
}: ModalWrapperProps): React.ReactElement {
  const { closeModal } = useModal();
  
  const handleClose = (): void => {
    if (onClose) {
      onClose();
    } else {
      closeModal();
    }
  };
  
  return (
    <div className="p-6 w-full">
      {(title || showCloseButton) && (
        <div className="flex justify-between items-center mb-4">
          {title && <h2 className="text-xl font-bold text-gray-100">{title}</h2>}
          
          {showCloseButton && (
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}

      <div className="mb-6">
        {children}
      </div>

      {footer && (
        <div className="mt-6 flex justify-end space-x-3">
          {footer}
        </div>
      )}
    </div>
  );
} 