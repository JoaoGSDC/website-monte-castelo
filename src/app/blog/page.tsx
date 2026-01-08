import { Metadata } from 'next';
import styles from './styles.module.scss';
import BlogHeader from './components/BlogHeader';
import BlogPosts from './components/BlogPosts';
import BlogFilters from './components/BlogFilters';
import PaginationWrapper from './components/PaginationWrapper';
import { IPost } from '@/interfaces/post.interface';
import api from '@/services/api';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://academiamontecastelo.com.br';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Blog da Academia Monte Castelo: artigos, dicas e informações sobre segurança privada, formação de vigilantes, atualizações da legislação e mercado de trabalho.',
  keywords: [
    'blog segurança privada',
    'artigos vigilantes',
    'dicas segurança',
    'legislação vigilante',
    'mercado segurança privada',
    'notícias segurança',
  ],
  openGraph: {
    title: 'Blog - Academia Monte Castelo',
    description:
      'Artigos, dicas e informações sobre segurança privada, formação de vigilantes e atualizações do setor.',
    url: `${baseUrl}/blog`,
    type: 'website',
    images: [
      {
        url: `${baseUrl}/icon512x512.png`,
        width: 1200,
        height: 630,
        alt: 'Blog Academia Monte Castelo',
      },
    ],
  },
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
};

const fetchPosts = async (search?: string) => {
  try {
    const url = search ? `/posts/search?q=${encodeURIComponent(search)}` : `/posts/`;
    const res = await api.get<IPost[]>(url);
    return { posts: res.data };
  } catch (error: any) {
    console.error(error);
    return { posts: [] };
  }
};

const Blog = async ({ searchParams }: any) => {
  const search = searchParams?.search ?? '';
  const content = await fetchPosts(search);

  return (
    <div className={styles.container}>
      <BlogHeader />

      <div className={styles.content}>
        <BlogPosts content={content} />
        <BlogFilters />
      </div>

      <PaginationWrapper totalPages={1} />
    </div>
  );
};

export default Blog;
