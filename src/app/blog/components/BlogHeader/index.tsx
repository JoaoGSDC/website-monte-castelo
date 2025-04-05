import Image from 'next/image';
import React from 'react';
import styles from './styles.module.scss';

const BlogHeader: React.FC = () => {
  return (
    <div className={styles.header}>
      <figure>
        <Image src="/images/blog-posts-cover.png" alt="Blog Cover" layout="fill" objectFit="cover" />
      </figure>

      <div className={styles.text}>
        <h1>Blog</h1>
        <h2>Academia Monte Castelo</h2>
      </div>
    </div>
  );
};

export default BlogHeader;
