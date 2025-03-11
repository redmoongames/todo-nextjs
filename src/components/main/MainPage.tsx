import { Button } from '../ui/Button';
import { LoginSkeleton } from './LoginSkeleton';
import { StickyNote } from './StickyNote';
import { useLoginContent } from './useLoginContent';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { loginContent, isLoadingLoginContent } = useLoginContent();

  const handleLogin = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push('/dashboard');
  };

  if (isLoadingLoginContent) {
    return <LoginSkeleton />;
  }

  return (
    <main>
      <div className="min-h-screen bg-gray-900 p-4 md:p-6">
        <div className="max-w-lg mx-auto bg-gray-800 rounded-xl shadow-xl p-6 md:p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {loginContent.title}
            </h1>
            <p className="text-sm md:text-base text-gray-300 whitespace-pre-line">
              {loginContent.description}
            </p>
          </div>

          <div className="space-y-6 max-w-md mx-auto">
            <div className="space-y-4">
              <input
                type="text"
                placeholder={loginContent.form.usernamePlaceholder}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm md:text-base text-white placeholder-gray-400"
              />
              <input
                type="password"
                placeholder={loginContent.form.passwordPlaceholder}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm md:text-base text-white placeholder-gray-400"
              />
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button variant="secondary" fullWidth disabled={isLoading}>
                  {loginContent.form.registerButton}
                </Button>
                <Button variant="primary" fullWidth onClick={handleLogin} disabled={isLoading}>
                  {isLoading ? 'Loading...' : loginContent.form.submitButton}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <StickyNote 
          login={loginContent.demo.login} 
          password={loginContent.demo.password} 
        />
      </div>
    </main>
  );
} 