import { redirect } from 'next/navigation';
import DashboardClient from './_components/DashboardClient';
import { fetchTasks } from './_lib/fetchTasks';

export default async function DashboardPage() {
  const initialTasks = await fetchTasks();
  
  // If we couldn't fetch tasks, let the client-side handle authentication
  // The AuthWrapper in the layout will redirect if needed
  
  return <DashboardClient initialTasks={initialTasks || undefined} />;
}
