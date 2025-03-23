'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { useAuthState } from '@/features/auth/hooks/useAuthState';

// Separate component to handle search params
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  const { isAuthenticated, isLoading } = useAuthState();
  const { login, error, isSubmitting } = useLogin();

  // Handle automatic redirect if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated && !isRedirecting) {
      setIsRedirecting(true);
      router.replace(callbackUrl);
    }
  }, [isAuthenticated, isLoading, router, callbackUrl, isRedirecting]);

  // Handle login form submission
  const handleLogin = async (credentials: { username: string; password: string; rememberMe: boolean }) => {
    if (isRedirecting) return;

    const result = await login(credentials);
    if (result.success) {
      setIsRedirecting(true);
      router.replace(callbackUrl);
    }
  };

  // Prevent showing the form while redirecting
  if (isRedirecting) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <p className="text-center text-gray-500 mb-2">Login successful</p>
        <p className="text-center text-gray-500">Redirecting...</p>
      </div>
    );
  }

  return (
    <LoginForm
      onSubmit={handleLogin}
      error={error}
      isSubmitting={isSubmitting || isRedirecting}
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-4">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
} 