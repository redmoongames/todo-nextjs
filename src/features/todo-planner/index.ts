// Export context and provider
export * from './components/TodoContext';
export { TodoProvider } from './components/TodoProvider';

// Export hooks
export { useTodo } from './hooks/useTodo';

// Export services
export { todoService } from './services/TodoService';
export { dashboardService } from './services/DashboardService';

// Export types - using explicit path
export type * from './types/index';

// Re-export specific types for backward compatibility
export type { TodoPriority as TaskPriority } from './types/core/TodoTypes';
export type { Todo as Task } from './types/core/TodoTypes';
export type { CreateTodoInput } from './types/api/RequestTypes';
export { PRIORITY_OPTIONS } from './types/core/TodoTypes'; 