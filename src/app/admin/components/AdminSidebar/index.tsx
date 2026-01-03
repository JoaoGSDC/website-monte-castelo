'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './styles.module.scss';
import Image from 'next/image';
import {
  FiHome,
  FiFileText,
  FiImage,
  FiVideo,
  FiBook,
  FiFile,
  FiSliders,
  FiLogOut,
} from 'react-icons/fi';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: FiHome },
    { href: '/admin/blog', label: 'Blog', icon: FiFileText },
    { href: '/admin/cursos', label: 'Cursos', icon: FiBook },
    { href: '/admin/imagens', label: 'Imagens', icon: FiImage },
    { href: '/admin/carrossel', label: 'Carrossel', icon: FiSliders },
    { href: '/admin/videos', label: 'Vídeos', icon: FiVideo },
    { href: '/admin/biblioteca', label: 'Biblioteca', icon: FiFile },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Image src="/logo-black.png" alt="Logo" width={180} height={70} />
      </div>
      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <Icon />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <button onClick={handleLogout} className={styles.logoutButton}>
        <FiLogOut />
        <span>Sair</span>
      </button>
    </aside>
  );
}

