'use client';

import { ReactNode, useEffect, useState } from 'react';
import { AuthProvider } from '@/shared/auth/auth-context';
import { TodoProvider } from '@/shared/todo';
import { ModalProvider, Modal } from '@/shared/components/modal';
import { ErrorBoundary } from '@/shared/components/error-boundary';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export default function Providers({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <LoadingSpinner />;
  }

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