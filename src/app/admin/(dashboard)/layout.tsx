import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import AdminSidebar from '../components/AdminSidebar';
import styles from '../styles.module.scss';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect('/admin/login');
  }

  return (
    <div className={styles.adminWrapper}>
      <div className={styles.adminLayout}>
        <AdminSidebar />
        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
}

