'use client';

import React, { useState } from 'react';
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
    <div className={styles.highlightsContainer}>
      {items.map((item, index) => (
        <div key={index} className={styles.thumbnail} onClick={() => setActiveVideo(item.video)}>
          <div className={styles.playIcon}>▶</div>
          <img src={item.image} alt={`Highlight ${index}`} />
          <div className={styles.overlay}>Assistir</div>
        </div>
      ))}

      {activeVideo && (
        <div className={styles.videoOverlay} onClick={() => setActiveVideo(null)}>
          <div className={styles.videoWrapper} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setActiveVideo(null)}>
              ✖
            </button>
            <video src={activeVideo} controls autoPlay />
          </div>
        </div>
      )}
    </div>
  );
};

export default Highlights;
