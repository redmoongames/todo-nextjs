import TodoLayoutClient from './TodoLayoutClient';

export default function TodoLayout({ children }: { children: React.ReactNode }) {
  return <TodoLayoutClient>{children}</TodoLayoutClient>;
}
