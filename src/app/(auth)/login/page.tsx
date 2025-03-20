'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/shared/auth/auth-context';
import { PageBackground } from '@/shared/components/ui/PageBackground';
import { LoginForm } from './_components/LoginForm';

interface LoginCredentials {
  username: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/todo/dashboard');
    }
  }, [isAuthenticated, router]);

  // Handle login submission
  const handleLogin = async (credentials: LoginCredentials) => {
    const { username, password, rememberMe } = credentials;

    if (!username || !password) {
      setError('Username or email and password are required');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      console.log('[LOGIN] Submitting login data with username:', username);
      const result = await login(username, password);
      console.log('[LOGIN] Login result:', result);
      
      if (!result.success && result.message) {
        // This is a validation error from the server
        setError(result.message);
        return;
      }
      
      // On success, redirect to dashboard
      if (result.success) {
        router.push('/todo/dashboard');
      }
    } catch (err) {
      console.error('[LOGIN] Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking authentication
  if (isAuthenticated) {
    return null;
  }

  return (
    <PageBackground style="glass">
      <LoginForm
        onSubmit={handleLogin}
        error={error}
        isSubmitting={isSubmitting}
      />
    </PageBackground>
  );
} 