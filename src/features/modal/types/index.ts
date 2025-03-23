import { ReactNode } from 'react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ModalPosition = 'center' | 'top' | 'right' | 'bottom' | 'left';

export interface ModalOptions {
  size?: ModalSize;
  position?: ModalPosition;
  closeOnEscape?: boolean;
  closeOnBackdropClick?: boolean;
  className?: string;
  preventScroll?: boolean;
  showCloseButton?: boolean;
  transitionDuration?: number;
}

export interface ModalContextType {
  isOpen: boolean;
  modalContent: ReactNode;
  modalOptions: ModalOptions;
  openModal: (content: ReactNode, options?: ModalOptions) => void;
  closeModal: () => void;
}

export interface ModalProps {
  children?: ReactNode;
}

export interface ModalWrapperProps {
  title?: string;
  onClose?: () => void;
  footer?: ReactNode;
  children: ReactNode;
  showCloseButton?: boolean;
} 