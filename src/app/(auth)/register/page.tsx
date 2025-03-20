'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/shared/auth/auth-context';
import { PageBackground } from '@/shared/components/ui/PageBackground';
import { RegisterForm } from './_components/RegisterForm';

interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/todo/dashboard');
    }
  }, [isAuthenticated, router]);

  // Handle registration
  const handleRegister = async (data: RegisterData) => {
    const { username, email, password, confirmPassword } = data;

    // Client-side validation
    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      console.log('[REGISTER] Submitting registration data:', { username, email });
      const result = await register(username, email, password, confirmPassword);
      console.log('[REGISTER] Registration result:', result);
      
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
      console.error('[REGISTER] Registration error:', err);
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
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
      <RegisterForm
        onSubmit={handleRegister}
        error={error}
        isSubmitting={isSubmitting}
      />
    </PageBackground>
  );
} 