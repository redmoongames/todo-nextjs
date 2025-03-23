'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { TodoProvider } from '@/features/todo-planner';
import { ModalProvider, Modal } from '@/features/modal';
import { ErrorBoundary } from '@/common-ui/error-boundary';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary fallback={<div>Something went wrong. Please refresh the page.</div>}>
      <AuthProvider>
        <TodoProvider>
          <ModalProvider>
            {children}
            <Modal />
          </ModalProvider>
        </TodoProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
} 