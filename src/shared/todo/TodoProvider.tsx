'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { TodoService } from './TodoService';

interface TodoContextType {
  todoService: TodoService;
}

const TodoContext = createContext<TodoContextType | null>(null);

export function useTodo(): TodoContextType {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
}

export function useTodoService(): TodoService {
  return useTodo().todoService;
}

export function TodoProvider({ children }: { children: ReactNode }) {
  const todoService = TodoService.getInstance();
  
  return (
    <TodoContext.Provider value={{ todoService }}>
      {children}
    </TodoContext.Provider>
  );
} 