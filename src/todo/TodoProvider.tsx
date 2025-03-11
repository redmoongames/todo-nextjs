'use client';

import React, { createContext, useContext, ReactNode, useState } from 'react';
import { TodoService } from './TodoService';

// Initialize the TodoService
const todoService = TodoService.getInstance();

// Create context
interface TodoContextValue {
  todoService: TodoService;
  isLoading: boolean;
  error: string | null;
}

const TodoContext = createContext<TodoContextValue | null>(null);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [isLoading] = useState<boolean>(false);
  const [error] = useState<string | null>(null);

  const value: TodoContextValue = {
    todoService,
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