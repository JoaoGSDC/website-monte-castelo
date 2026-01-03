/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from 'next/navigation';
import styles from './styles.module.scss';
import BlogHeader from '../components/BlogHeader';
import BlogFilters from '../components/BlogFilters';
import Image from 'next/image';
import LastBlogPosts from '@/sections/LastBlogPosts';
import { IPost } from '@/interfaces/post.interface';
import api from '@/services/api';

async function fetchPost(slug: string) {
  try {
    const res = await api.get<IPost>(`/posts/${slug}`);
    return res.data;
  } catch (error: any) {
    console.error('Error fetching post:', error?.message || error);
    if (error?.code === 'ECONNRESET' || error?.code === 'ETIMEDOUT') {
      console.error('Connection error - the server may be temporarily unavailable');
    }
    return null;
  }
}

const getLatestPosts = async () => {
  try {
    const res = await api.get<IPost[]>(`/posts/last`);
    const posts = res.data;

    return posts;
  } catch (error) {
    console.error('Error fetching latest posts:', error);
    return [];
  }
};

export default async function BlogPost({ params }: any) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  const latestPosts = await getLatestPosts();

  if (!post) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <BlogHeader />

      <div className={styles.content}>
        <div className={styles.post}>
          <div className={styles.header}>
            <h1>{post.title}</h1>
            <figure>
              <Image src={post.image} alt={post.title} layout="fill" objectFit="cover" />
            </figure>
          </div>

          <div className={styles.text} dangerouslySetInnerHTML={{ __html: post.content as string }} />
        </div>

        <BlogFilters />
      </div>

      <div className={styles.lastPosts}>
        <LastBlogPosts posts={latestPosts} />
      </div>

      <div className={styles.divider} />
    </div>
  );
}
