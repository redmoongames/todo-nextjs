import Link from 'next/link';
import { PageBackground } from '@/common-ui/PageBackground';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <PageBackground style="glass">
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-center mb-10">
          <Link href="/" className="text-white hover:text-gray-200 transition-colors">
            <span className="font-bold text-2xl">TODO.app</span>
          </Link>
        </div>
        {children}
        <div className="text-center mt-12 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} TODO.app. All rights reserved.</p>
        </div>
      </div>
    </PageBackground>
  );
} 