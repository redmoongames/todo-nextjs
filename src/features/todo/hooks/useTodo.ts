import { useContext } from 'react';
import { TodoContext } from '../contexts/TodoContext';

export function useTodo() {
  const context = useContext(TodoContext);
  
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  
  return context;
} 