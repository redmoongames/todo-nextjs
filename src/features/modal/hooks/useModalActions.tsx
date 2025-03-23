'use client';

import { ReactNode } from 'react';
import { useModal } from '../providers/ModalProvider';
import { ModalOptions } from '../types';
import { ModalWrapper } from '../components/ModalWrapper';

interface ConfirmModalOptions {
  title?: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'primary' | 'success';
  modalOptions?: ModalOptions;
}

interface AlertModalOptions {
  title?: string;
  message: string | ReactNode;
  buttonText?: string;
  variant?: 'info' | 'success' | 'warning' | 'danger';
  modalOptions?: ModalOptions;
}

export function useModalActions() {
  const { openModal, closeModal } = useModal();
  
  // Show a confirmation dialog and return a promise that resolves to boolean
  const confirm = (options: ConfirmModalOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      const handleConfirm = () => {
        closeModal();
        resolve(true);
      };
      
      const handleCancel = () => {
        closeModal();
        resolve(false);
      };
      
      const getButtonClass = () => {
        switch (options.confirmVariant) {
          case 'danger':
            return 'bg-red-600 hover:bg-red-700';
          case 'success':
            return 'bg-green-600 hover:bg-green-700';
          default:
            return 'bg-blue-600 hover:bg-blue-700';
        }
      };
      
      openModal(
        <ModalWrapper
          title={options.title || 'Confirm'}
          footer={
            <>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                {options.cancelText || 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 ${getButtonClass()}`}
              >
                {options.confirmText || 'Confirm'}
              </button>
            </>
          }
        >
          <div className="text-gray-300">
            {options.message}
          </div>
        </ModalWrapper>,
        { size: 'sm', ...options.modalOptions }
      );
    });
  };
  
  // Show an alert dialog and return a promise that resolves when closed
  const alert = (options: AlertModalOptions): Promise<void> => {
    return new Promise((resolve) => {
      const handleClose = () => {
        closeModal();
        resolve();
      };
      
      const getIconAndColor = () => {
        switch (options.variant) {
          case 'success':
            return {
              color: 'text-green-400',
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              )
            };
          case 'warning':
            return {
              color: 'text-yellow-400',
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )
            };
          case 'danger':
            return {
              color: 'text-red-400',
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )
            };
          case 'info':
          default:
            return {
              color: 'text-blue-400',
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )
            };
        }
      };
      
      const { color, icon } = getIconAndColor();
      
      openModal(
        <ModalWrapper
          title={options.title || 'Alert'}
          footer={
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {options.buttonText || 'OK'}
            </button>
          }
        >
          <div className="flex items-start space-x-4">
            <div className={`flex-shrink-0 ${color}`}>
              {icon}
            </div>
            <div className="text-gray-300">
              {options.message}
            </div>
          </div>
        </ModalWrapper>,
        { size: 'sm', ...options.modalOptions }
      );
    });
  };
  
  // Use with form components
  const withForm = <T extends object>(
    FormComponent: React.ComponentType<T & { onClose: () => void }>,
    props: T,
    modalOptions?: ModalOptions
  ): void => {
    openModal(
      <FormComponent {...props} onClose={closeModal} />,
      modalOptions
    );
  };
  
  return {
    confirm,
    alert,
    withForm
  };
} 