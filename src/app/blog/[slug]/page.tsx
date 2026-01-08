import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import styles from './styles.module.scss';
import BlogHeader from '../components/BlogHeader';
import BlogFilters from '../components/BlogFilters';
import Image from 'next/image';
import LastBlogPosts from '@/sections/LastBlogPosts';
import { IPost } from '@/interfaces/post.interface';
import api from '@/services/api';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://academiamontecastelo.com.br';

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

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPost(slug);

  if (!post) {
    return {
      title: 'Post não encontrado',
    };
  }

  // Extrair texto do HTML para descrição
  const textContent = post.content?.replace(/<[^>]*>/g, '').substring(0, 160) || post.description || '';

  return {
    title: post.title,
    description: textContent,
    keywords: post.tags || [],
    openGraph: {
      title: post.title,
      description: textContent,
      url: `${baseUrl}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: ['Academia Monte Castelo'],
      images: [
        {
          url: post.image?.startsWith('http') ? post.image : `${baseUrl}${post.image}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: textContent,
      images: [post.image?.startsWith('http') ? post.image : `${baseUrl}${post.image}`],
    },
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug}`,
    },
  };
}

export default async function BlogPost({ params }: any) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  const latestPosts = await getLatestPosts();

  if (!post) {
    notFound();
  }

  // Structured Data - BlogPosting
  const blogPostSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description || post.content?.replace(/<[^>]*>/g, '').substring(0, 200),
    image: post.image?.startsWith('http') ? post.image : `${baseUrl}${post.image}`,
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: {
      '@type': 'Organization',
      name: 'Academia Monte Castelo',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Academia Monte Castelo',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
      />
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
    </>
  );
}
