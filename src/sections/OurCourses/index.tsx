'use client';

import styles from './styles.module.scss';
import button from '../../styles/button.module.scss';
import Subtitle from '@/components/Subtitle';
import { scrollToSection } from '@/utils/scrollToSection';
import CardFlip from '@/components/CardFlip';
import { ICourse } from '@/interfaces/course.interface';
import { getCourseIcon } from '@/utils/courseIcons';
import { useApiCache } from '@/hooks/useApiCache';

export default function OurCourses() {
  const { data: courses, loading } = useApiCache<ICourse[]>('/api/courses');
  const { data: imagesData } = useApiCache<{
    home?: { ourCoursesImage?: string };
  }>('/api/imagens');

  const ourCoursesImage = imagesData?.home?.ourCoursesImage || '/images/background-6.jpg';
  const coursesList = Array.isArray(courses) ? courses : [];

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
          ) : coursesList.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>
              Nenhum curso disponível no momento.
            </div>
          ) : (
            coursesList.map((course) => (
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

      <div className={styles.contact} style={{ backgroundImage: `url('${ourCoursesImage}')` }} aria-label="Seção de contato">
        <h2>Seja um profissional destacado</h2>
        <h1>{`(19) 9 7410-2924`}</h1>
        <button className={button.primaryAlternative} onClick={() => scrollToSection('contato')}>
          saiba mais
        </button>
      </div>
    </section>
  );
}
