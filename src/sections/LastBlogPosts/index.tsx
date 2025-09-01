import Subtitle from '@/components/Subtitle';
import React from 'react';
import Image from 'next/image';

import styles from './styles.module.scss';
import { FaRegNewspaper } from 'react-icons/fa6';
import Link from 'next/link';
import { IPost } from '@/interfaces/post.interface';

interface LastBlogPostsProps {
  posts?: IPost[];
}

const LastBlogPosts: React.FC<LastBlogPostsProps> = ({ posts }) => {
  return (
    <section className={styles.container}>
      <Subtitle text="Novidades do blog" color="#fff" />

      <h1>Confira as últimas postagens do nosso blog</h1>

      <div className={styles.cards}>
        {posts?.map((post) => (
          <Link
            href={`/blog/${
              post.title
                .toLowerCase()
                .normalize('NFD') // separa letras de acentos
                .replace(/[\u0300-\u036f]/g, '') // remove acentos
                .replace(/[^\w\s-]/g, '') // remove caracteres especiais
                .trim()
                .replace(/\s+/g, '-') // substitui espaços por hífens
            }
                  `}
            key={post?._id}
            className={styles.card}
          >
            <figure className={styles.figure}>
              <Image
                src={post?.image}
                alt={post?.title}
                layout="responsive"
                width={500}
                height={300}
                className={styles.image}
              />
            </figure>

            <div className={styles.textContent}>
              <div className={styles.block}>
                <FaRegNewspaper />
              </div>
              <h2 title={post?.title} className={styles.title}>
                {post?.title}
              </h2>
              <p className={styles.excerpt}>{post?.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default LastBlogPosts;
