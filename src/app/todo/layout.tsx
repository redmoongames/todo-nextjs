'use client';

import { AuthWrapper } from '@/auth';
import { SlideMenuWrapper } from '@/components/slideMenu/SlideMenuWrapper';

export default function TodoLayout({ children }: { children: React.ReactNode }) {
  const handleAuthSuccess = () => {
    console.debug("[TODO LAYOUT] User is authenticated, showing todo layout");
  };
  
  return (
    <AuthWrapper 
      loadingMessage="Checking login status..."
      onAuthSuccess={handleAuthSuccess}
    >
      <SlideMenuWrapper>
        {children}
      </SlideMenuWrapper>
    </AuthWrapper>
  );
}
