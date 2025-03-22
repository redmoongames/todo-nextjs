'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { useRegister } from '@/features/auth/hooks/useRegister';
import { useAuthState } from '@/features/auth/hooks/useAuthState';

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthState();
  const { register, error, isSubmitting } = useRegister();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/todo/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleRegister = async (data: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    const result = await register(data);
    
    if (result.success) {
      router.push('/login');
    }
  };

  return (
    <RegisterForm
      onSubmit={handleRegister}
      error={error}
      isSubmitting={isSubmitting}
    />
  );
} 