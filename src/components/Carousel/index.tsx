'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './styles.module.scss';
import Link from 'next/link';

interface CarouselItem {
  image: string;
  hollowText?: string;
  title?: string;
  titleMarked?: string;
  buttonPrimary?: string;
  buttonPrimaryLink?: string;
  buttonSecondary?: string;
  buttonSecondaryLink?: string;
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
    <section className={styles.carousel} role="region" aria-label="Carrossel de imagens">
      {items.map((item, index) => (
        <div key={index} className={styles.items}>
          {index === currentIndex && (
            <div className={styles.carouselContainer}>
              {(item.hollowText || item.title || item.titleMarked || item.buttonPrimary || item.buttonSecondary) && (
                <div className={styles.container}>
                  {item.hollowText && <h1 className={styles.hollowText}>{item.hollowText}</h1>}
                  {item.title && <h1 className={styles.title}>{item.title}</h1>}
                  {item.titleMarked && <h1 className={styles.titleMarked}>{item.titleMarked}</h1>}
                  {(item.buttonPrimary || item.buttonSecondary) && (
                    <div className={styles.buttonsContainer}>
                      {item.buttonPrimary && item.buttonPrimaryLink && (
                        <Link
                          href={item.buttonPrimaryLink}
                          className={styles.buttonPrimary}
                          target={item.buttonPrimaryLink.startsWith('http') ? '_blank' : undefined}
                          rel={item.buttonPrimaryLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                          aria-label={item.buttonPrimary}
                        >
                          {item.buttonPrimary}
                        </Link>
                      )}
                      {item.buttonSecondary && item.buttonSecondaryLink && (
                        <Link
                          href={item.buttonSecondaryLink}
                          className={styles.buttonSecondary}
                          target={item.buttonSecondaryLink.startsWith('http') ? '_blank' : undefined}
                          rel={item.buttonSecondaryLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                          aria-label={item.buttonSecondary}
                        >
                          {item.buttonSecondary}
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div
            className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
            aria-hidden={index !== currentIndex}
          >
            <Image
              src={item.image}
              alt={item.title || item.titleMarked || `Imagem do carrossel ${index + 1}`}
              fill
              priority={index === 0}
              loading={index === 0 ? 'eager' : 'lazy'}
              sizes="100vw"
              quality={85}
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      ))}
    </section>
  );
};

export default Carousel;
