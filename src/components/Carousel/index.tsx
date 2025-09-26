'use client';

import { useState, useEffect } from 'react';
import styles from './styles.module.scss';
import Link from 'next/link';

interface CarouselItem {
  image: string;
  hollowText: string;
  title: string;
  titleMarked: string;
  buttonPrimary: string;
  buttonSecondary: string;
}

const Carousel = ({ items }: { items: CarouselItem[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <>
      <div className={styles.carousel}>
        {items.map((item, index) => (
          <div key={index} className={styles.items}>
            {index === currentIndex && (
              <div className={styles.carouselContainer}>
                <div className={styles.container}>
                  <h1 className={styles.hollowText}>{item.hollowText}</h1>
                  <h1 className={styles.title}>{item.title}</h1>
                  <h1 className={styles.titleMarked}>{item.titleMarked}</h1>
                  <div className={styles.buttonsContainer}>
                    <Link href="/cursos/armas-nao-letais" className={styles.buttonPrimary}>
                      {item.buttonPrimary}
                    </Link>
                    <Link
                      href="https://forms.gle/c3JLdbkw3S5rPWZ39"
                      className={styles.buttonSecondary}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.buttonSecondary}
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <div
              className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
              style={{ backgroundImage: `url(${item.image})` }}
            ></div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Carousel;
