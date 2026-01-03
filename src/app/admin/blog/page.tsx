'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './styles.module.scss';
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { IPost } from '@/interfaces/post.interface';

export default function BlogPage() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      
      // Garantir que sempre seja um array
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        console.error('Resposta da API não é um array:', data);
        setPosts([]);
      }
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;

    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPosts();
      } else {
        alert('Erro ao excluir post');
      }
    } catch (error) {
      console.error('Erro ao excluir post:', error);
      alert('Erro ao excluir post');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Gerenciar Blog</h1>
          <p>Gerencie os posts do blog</p>
        </div>
        <Link href="/admin/blog/novo" className={styles.addButton}>
          <FiPlus />
          Novo Post
        </Link>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Título</th>
              <th>Categoria</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.empty}>
                  Nenhum post encontrado
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post._id}>
                  <td>
                    <img src={post.image} alt={post.title} className={styles.image} />
                  </td>
                  <td>{post.title}</td>
                  <td>{post.category || '-'}</td>
                  <td>{post.createdAt ? new Date(post.createdAt).toLocaleDateString('pt-BR') : '-'}</td>
                  <td>
                    <div className={styles.actions}>
                      <Link href={`/blog/${post.slug}`} target="_blank" className={styles.actionButton}>
                        <FiEye />
                      </Link>
                      <Link href={`/admin/blog/${post._id}`} className={styles.actionButton}>
                        <FiEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

