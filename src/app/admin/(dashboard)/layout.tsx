import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

// Layout para garantir autenticação nas páginas do dashboard
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect('/admin/login');
  }

  return <>{children}</>;
}
