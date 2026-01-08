'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './styles.module.scss';

interface HighlightItem {
  image: string;
  video: string;
}

interface HighlightsProps {
  items: HighlightItem[];
}

const Highlights: React.FC<HighlightsProps> = ({ items }) => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section className={styles.highlightsContainer} aria-label="Vídeos de depoimentos">
      {items.map((item, index) => (
        <div
          key={index}
          className={styles.thumbnail}
          onClick={() => setActiveVideo(item.video)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setActiveVideo(item.video);
            }
          }}
          aria-label={`Assistir depoimento ${index + 1}`}
        >
          <div className={styles.playIcon} aria-hidden="true">▶</div>
          <Image
            src={item.image}
            alt={`Thumbnail do depoimento ${index + 1}`}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            loading="lazy"
            quality={75}
            style={{ objectFit: 'cover' }}
          />
          <div className={styles.overlay} aria-hidden="true">Assistir</div>
        </div>
      ))}

      {activeVideo && (
        <div
          className={styles.videoOverlay}
          onClick={() => setActiveVideo(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Reprodutor de vídeo"
        >
          <div className={styles.videoWrapper} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeButton}
              onClick={() => setActiveVideo(null)}
              aria-label="Fechar vídeo"
            >
              ✖
            </button>
            <video src={activeVideo} controls autoPlay aria-label="Vídeo de depoimento" />
          </div>
        </div>
      )}
    </section>
  );
};

export default Highlights;
