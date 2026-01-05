'use client';

import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import button from '../../styles/button.module.scss';
import Subtitle from '@/components/Subtitle';
import { scrollToSection } from '@/utils/scrollToSection';
import CardFlip from '@/components/CardFlip';
import { ICourse } from '@/interfaces/course.interface';
import { getCourseIcon } from '@/utils/courseIcons';

export default function OurCourses() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        }
      } catch (error) {
        console.error('Erro ao buscar cursos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <section id="cursos" className={styles.container}>
      <div className={styles.content}>
        <div className={styles.textContent}>
          <Subtitle text="Nossos cursos" />

          <div className={styles.title}>
            <h1>Conheça nossos cursos</h1>

            <p>
              Oferecemos cursos especializados para formar vigilantes altamente capacitados, preparados para atuar com
              excelência e profissionalismo. Nossa missão é garantir a sua qualificação com treinamento completo e
              atualizado, seguindo todas as normas de segurança.
            </p>
          </div>
        </div>

        <div className={styles.courses}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando cursos...</div>
          ) : courses.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Nenhum curso disponível no momento.</div>
          ) : (
            courses.map((course) => (
              <CardFlip
                key={course._id || course.slug}
                icon={getCourseIcon(course.icon)}
                title={course.title}
                subtitle={course.subtitle}
                description={course.description}
                backDescription={course.backDescription}
              />
            ))
          )}
        </div>
      </div>

      <div className={styles.contact}>
        <h2>Seja um profissional destacado</h2>
        <h1>{`(19) 9 7410-2924`}</h1>
        <button className={button.primaryAlternative} onClick={() => scrollToSection('contato')}>
          saiba mais
        </button>
      </div>
    </section>
  );
}
