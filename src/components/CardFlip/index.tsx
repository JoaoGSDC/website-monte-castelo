'use client';

import { useState } from 'react';
import styles from './styles.module.scss';

interface CardFlipProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  backDescription: string;
}

export default function CardFlip({ icon, title, subtitle, description, backDescription }: CardFlipProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className={`${styles.card} ${flipped ? styles.flipped : ''}`}>
      <div className={styles.inner}>
        <div className={styles.front}>
          <div className={styles.image}>
            {icon}
            <span>☆</span>
          </div>
          <div className={styles.courseContent}>
            <h4>{subtitle}</h4>
            <h1>{title}</h1>
            <hr />
            <p>{description}</p>
            <button type="button" onClick={() => setFlipped(true)}>
              Ver mais +
            </button>
          </div>
        </div>

        <div className={styles.back}>
          <div className={styles.courseContent}>
            <h1>{title}</h1>
            <hr />
            <p>{backDescription}</p>
            <button type="button" onClick={() => setFlipped(false)}>
              Ver menos -
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
