'use client';

import React, { createContext, useContext, ReactNode, useState } from 'react';
import { Task, Label } from './types';

export interface TodoContextValue {
  isLoading: boolean;
  error: string | null;
}

const TodoContext = createContext<TodoContextValue | null>(null);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const value: TodoContextValue = {
    isLoading,
    error
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
} 