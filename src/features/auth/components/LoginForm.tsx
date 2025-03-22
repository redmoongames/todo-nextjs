'use client';

import { useState } from 'react';
import Link from 'next/link';
import { InputPasswordField } from './InputPasswordField';
import { GradientButton } from '@/shared/components/ui/GradientButton';
import { Divider } from '@/shared/components/ui/Divider';
import { ErrorMessage } from './ErrorMessage';

interface LoginFormProps {
  onSubmit: (credentials: { username: string; password: string; rememberMe: boolean }) => Promise<void>;
  error: string | null;
  isSubmitting: boolean;
}

export function LoginForm({ onSubmit, error, isSubmitting }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      alert('Username or email is required');
      return;
    }
    
    if (!password) {
      alert('Password is required');
      return;
    }
    
    await onSubmit({ 
      username: username.trim(),
      password: password, 
      rememberMe 
    });
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Welcome back</h2>
        <p className="text-gray-300 text-lg">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        { error && ( <ErrorMessage error={error} /> ) }

        <InputPasswordField
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username or Email"
          label="Username or Email"
          icon={
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />

        <InputPasswordField
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          label="Password"
          icon={
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
          showPasswordToggle
          isPasswordVisible={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />

        <div className="flex items-center">
          <input
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-700 rounded bg-gray-800"
          />
          <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-300">
            Remember me for 30 days
          </label>
        </div>

        <GradientButton
          type="submit"
          text={isSubmitting ? "Signing in..." : "Sign in"}
          isLoading={isSubmitting}
          loadingText="Signing in..."
          disabled={isSubmitting}
        />
      </form>

      <Divider text="Don't have an account?" />

      <div className="text-center">
        <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          Create a new account
        </Link>
      </div>
    </div>
  );
} 