'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './styles.module.scss';
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { ICourse } from '@/interfaces/course.interface';

export default function CursosPage() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/admin/cursos');
      const data = await response.json();
      
      // Garantir que sempre seja um array
      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        console.error('Resposta da API não é um array:', data);
        setCourses([]);
      }
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este curso?')) return;

    try {
      const response = await fetch(`/api/admin/cursos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCourses();
      } else {
        alert('Erro ao excluir curso');
      }
    } catch (error) {
      console.error('Erro ao excluir curso:', error);
      alert('Erro ao excluir curso');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Gerenciar Cursos</h1>
          <p>Gerencie os cursos disponíveis</p>
        </div>
        <Link href="/admin/cursos/novo" className={styles.addButton}>
          <FiPlus />
          Novo Curso
        </Link>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Título</th>
              <th>Subtítulo</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.empty}>
                  Nenhum curso encontrado
                </td>
              </tr>
            ) : (
              courses.map((course) => {
                const courseImage = course.images && course.images.length > 0 ? course.images[0] : null;
                return (
                  <tr key={course._id}>
                    <td>
                      {courseImage ? (
                        <img src={courseImage} alt={course.title} className={styles.image} />
                      ) : (
                        <div className={styles.imagePlaceholder}>Sem imagem</div>
                      )}
                    </td>
                    <td>{course.title}</td>
                    <td>{course.subtitle || '-'}</td>
                    <td>{course.createdAt ? new Date(course.createdAt).toLocaleDateString('pt-BR') : '-'}</td>
                    <td>
                      <div className={styles.actions}>
                        <Link href={`/cursos/${course.slug}`} target="_blank" className={styles.actionButton}>
                          <FiEye />
                        </Link>
                        <Link href={`/admin/cursos/${course._id}`} className={styles.actionButton}>
                          <FiEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(course._id!)}
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

