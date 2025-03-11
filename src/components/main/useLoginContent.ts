import { useState, useEffect } from 'react';
import { LoginContent, defaultLoginContent } from './types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchLoginContent(): Promise<LoginContent | null> {
  try {
    await delay(1500);
    return null;
  } catch (error) {
    console.warn('Failed to fetch login content:', error);
    return null;
  }
}

export function useLoginContent() {
  const [loginContent, setLoginContent] = useState<LoginContent>(defaultLoginContent);
  const [isLoadingLoginContent, setIsLoadingLoginContent] = useState(true);

  useEffect(() => {
    async function loadLoginContent() {
      const content = await fetchLoginContent();
      if (content) {
        setLoginContent(content);
      }
      setIsLoadingLoginContent(false);
    }

    loadLoginContent();
  }, []);

  return {
    loginContent,
    isLoadingLoginContent
  };
} 