'use client';

import React from 'react';
import styles from './styles.module.scss';
import Subtitle from '@/components/Subtitle';
import { FaSearch } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const BlogFilters: React.FC = () => {
  const [title, setTitle] = React.useState<string>('');
  const router = useRouter();

  const handleSearch = () => {
    const query = title.trim();
    if (query) {
      router.push(`/blog?search=${encodeURIComponent(query)}`);
    } else {
      router.push('/blog');
    }
  };

  return (
    <div className={styles.filters}>
      <div className={styles.search}>
        <Subtitle text="Pesquisar" color="var(--text-primary)" weight={700} size={16} />

        <div className={styles.input}>
          <input
            type="text"
            placeholder="Pesquisar..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          <button type="button" onClick={handleSearch}>
            <FaSearch />
          </button>
        </div>
      </div>

      <div className={styles.categories}>
        <Subtitle text="Categorias" color="var(--text-primary)" weight={700} size={16} />
        <ul>
          <li>
            <Link href="#">Segurança</Link>
          </li>
          <li>
            <Link href="#">Vigilância</Link>
          </li>
          <li>
            <Link href="#">CFTV</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BlogFilters;
