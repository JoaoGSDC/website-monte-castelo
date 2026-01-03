import styles from './styles.module.scss';
import { FiFileText, FiBook, FiImage, FiVideo, FiFile, FiSliders } from 'react-icons/fi';
import Link from 'next/link';

export default function DashboardPage() {
  const stats = [
    { label: 'Posts do Blog', icon: FiFileText, href: '/admin/blog', color: '#f57c30' },
    { label: 'Cursos', icon: FiBook, href: '/admin/cursos', color: '#4caf50' },
    { label: 'Imagens', icon: FiImage, href: '/admin/imagens', color: '#2196f3' },
    { label: 'Vídeos', icon: FiVideo, href: '/admin/videos', color: '#9c27b0' },
    { label: 'Carrossel', icon: FiSliders, href: '/admin/carrossel', color: '#ff9800' },
    { label: 'Biblioteca', icon: FiFile, href: '/admin/biblioteca', color: '#f44336' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Gerencie o conteúdo do website</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className={styles.statCard}>
              <div className={styles.iconWrapper} style={{ backgroundColor: `${stat.color}20` }}>
                <Icon style={{ color: stat.color }} />
              </div>
              <h3>{stat.label}</h3>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

