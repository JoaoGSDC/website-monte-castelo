'use client';

import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import button from '../../styles/button.module.scss';

import Modal from '../Modal';
import Link from 'next/link';
import Subtitle from '../Subtitle';
import Image from 'next/image';
import { useApiCache } from '@/hooks/useApiCache';
import { ICourse } from '@/interfaces/course.interface';

const CoursesListModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: coursesData } = useApiCache<ICourse[]>('/api/courses');
  const courses = coursesData?.map((course) => ({ slug: course.slug, title: course.title })) || [];

  useEffect(() => {
    const displayModal = sessionStorage.getItem('courses-list');

    if (displayModal && displayModal == '0') {
      return;
    }

    document.body.style.overflow = 'hidden';
    setIsOpen(true);
  }, []);

  const onClose = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';

    sessionStorage.setItem('courses-list', '0');
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} color="var(--text-primary)">
      <div className={styles.container}>
        <figure className={styles.logo}>
          <Image
            src="/logo-black.png"
            alt="Academia Monte Castelo - Logo"
            fill
            sizes="(max-width: 768px) 120px, 180px"
            loading="eager"
          />
        </figure>

        <Subtitle text="Confira nossos cursos" />

        <ul className={styles.leftBar}>
          {courses.map((course) => (
            <li key={course.slug}>
              <Link href={`/cursos/${course.slug}`} onClick={onClose}>
                {course.title}
              </Link>
            </li>
          ))}
        </ul>

        <button className={button.primaryVariant} type="button" onClick={onClose}>
          Conheça a Monte Castelo
        </button>
      </div>
    </Modal>
  );
};

export default CoursesListModal;
