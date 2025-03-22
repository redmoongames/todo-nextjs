import { PageBackground } from '@/shared/components/ui/PageBackground';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <PageBackground style="glass">
      <div className="w-full max-w-md mx-auto">
        {children}
      </div>
    </PageBackground>
  );
} 