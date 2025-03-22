// Export context and provider
export * from './contexts/TodoContext';
export { TodoProvider } from './TodoProvider';

// Export hooks
export * from './hooks';

// Export services
export * from './services/TodoService';
export * from './services';

// Export types - from types.ts
export { PRIORITY_OPTIONS } from './types';
export type { 
  CreateTodoInput, 
  UpdateTodoInput, 
  TodoFilterOptions, 
  TaskPriority,
  TaskStatus,
  Task,
  CompletedTask
} from './types';

// Export the Todo hook with a consistent name
export { useTodo } from './hooks'; 