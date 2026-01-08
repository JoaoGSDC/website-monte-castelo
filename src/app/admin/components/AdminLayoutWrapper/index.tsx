'use client';

import { usePathname } from 'next/navigation';
import AdminSidebar from '../AdminSidebar';
import styles from '../../styles.module.scss';

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Não exibir sidebar na página de login ou na página raiz do admin
  if (pathname === '/admin/login' || pathname === '/admin') {
    return <>{children}</>;
  }

  // Para todas as outras rotas do admin, mostrar sidebar
  return (
    <div className={styles.adminWrapper}>
      <div className={styles.adminLayout}>
        <AdminSidebar />
        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
}
