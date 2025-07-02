/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next';
import styles from './styles.module.scss';
import BlogHeader from './components/BlogHeader';
import BlogPosts from './components/BlogPosts';
import BlogFilters from './components/BlogFilters';
import PaginationWrapper from './components/PaginationWrapper';
import { IPost } from '@/interfaces/post.interface';
import api from '@/services/api';

export const metadata: Metadata = {
  title: 'Blog',
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
