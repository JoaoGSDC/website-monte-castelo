'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './styles.module.scss';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
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
      setCourses(data);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
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

      <div className={styles.coursesGrid}>
        {courses.length === 0 ? (
          <div className={styles.empty}>Nenhum curso encontrado</div>
        ) : (
          courses.map((course) => (
            <div key={course._id} className={styles.courseCard}>
              <h3>{course.title}</h3>
              <p className={styles.subtitle}>{course.subtitle}</p>
              <p className={styles.description}>{course.description}</p>
              <div className={styles.actions}>
                <Link href={`/admin/cursos/${course._id}`} className={styles.editButton}>
                  <FiEdit />
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(course._id!)}
                  className={styles.deleteButton}
                >
                  <FiTrash2 />
                  Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

