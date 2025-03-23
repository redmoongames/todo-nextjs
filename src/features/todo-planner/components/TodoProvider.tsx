'use client';

import { ReactNode } from 'react';
import { TodoContext } from './TodoContext';
import { useTodoContext } from '../hooks/useTodoContext';

interface TodoProviderProps {
  children: ReactNode;
}

export function TodoProvider({ children }: TodoProviderProps) {
  const todoContextValue = useTodoContext();
  
  return (
    <TodoContext.Provider value={todoContextValue}>
      {children}
    </TodoContext.Provider>
  );
} 