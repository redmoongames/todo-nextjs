'use client';

import { useState } from 'react';
import { useAuth } from '@/auth';
import { FormRegister } from './_components/FormRegister';
import { FormLogin } from './_components/FormLogin';
import { LoginOrRegisterButton } from './_components/LoginOrRegisterButton';

export default function Page() {
  const [isRegistering, setIsRegistering] = useState(false);
  const { login, register, isLoading, error } = useAuth();

  const handleSubmit = async (username: string, password: string) => {
    try {
      let success;
      if (isRegistering) {
        console.log('[LOGIN PAGE] Attempting registration...');
        success = await register(username, password);
      } else {
        console.log('[LOGIN PAGE] Attempting login...');
        success = await login(username, password);
      }
      
      if (success) {
        console.log('[LOGIN PAGE] Authentication successful');
        // Middleware will handle the redirect
      } else {
        console.log('[LOGIN PAGE] Authentication failed');
      }
    } catch (err) {
      console.error("[LOGIN PAGE] Authentication error:", err);
    }
  };

  const handleToggleMode = () => {
    setIsRegistering(!isRegistering);
  };

  const headerTest = isRegistering ? 'Create your account' : 'Sign in to your account';

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Checking authentication status...</p>
        </div>
      </div>
    );
  }

  // Show the login form (middleware will redirect if already authenticated)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            {headerTest}
          </h2>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-200 text-sm">
            {error}
          </div>
        )}

        {isRegistering ? (
          <FormRegister
            onSubmit={handleSubmit}
            disabled={isLoading}
            error={error || undefined}
          />
        ) : (
          <FormLogin
            onSubmit={handleSubmit}
            disabled={isLoading}
            error={error || undefined}
          />
        )}
        <p className="mt-2 text-center">
          <LoginOrRegisterButton
            isRegistering={isRegistering}
            onClick={handleToggleMode}
          />
        </p>
      </div>
    </div>
  );
} 