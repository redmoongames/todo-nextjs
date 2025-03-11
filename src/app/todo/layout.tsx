'use client';

import { AuthWrapper } from '@/auth';
import { SlideMenuWrapper } from '@/components/slideMenu/SlideMenuWrapper';

export default function TodoLayout({ children }: { children: React.ReactNode }) {
  const handleAuthSuccess = () => {
    console.debug("[TODO LAYOUT] User is authenticated, showing todo layout");
  };

  const handleAuthFail = () => {
    console.debug("[TODO LAYOUT] User is not authenticated, redirecting to login");
  };
  
  return (
    <AuthWrapper 
      isProtectContent={true} 
      loadingMessage="Checking login status..."
      onAuthSuccess={handleAuthSuccess}
      onAuthFail={handleAuthFail}
    >
      <SlideMenuWrapper>
        {children}
      </SlideMenuWrapper>
    </AuthWrapper>
  );
}
