import React from 'react';
import Image from 'next/image';
import styles from '../styles.module.scss';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Subtitle from '@/components/Subtitle';
import CoursesLeftBar from '@/components/CoursesLeftBar';

const IMAGES = [
  '/images/cursos-1.jpeg',
  '/images/cursos-2.jpeg',
  '/images/cursos-3.jpeg',
  '/images/cursos-4.jpeg',
  '/images/cursos-5.jpeg',
];

export default function EscoltaArmadaPage() {
  return (
    <>
      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h1>Escolta armada</h1>
            <h3>Preparação para Operações de Escolta Armada</h3>
          </div>

          <video width="320" height="240" controls={false} autoPlay muted loop>
            <source src="/videos/video-institucional.mp4" type="video/mp4" />
          </video>
        </div>

        <div className={styles.container}>
          <CoursesLeftBar />

          <div className={styles.content}>
            <Subtitle text="Sobre o curso" />
            <p>Capacite-se em prevenção, reação e uso de armamentos específicos.</p>
            <p>
              Formação para atuar na proteção de cargas e valores com ações preventivas e reativas. Treinamento com
              pistola .380 e escopeta calibre 12, seguindo os padrões da segurança armada profissional.
            </p>

            <div className={styles.carouselContainer}>
              <div className={styles.carousel}>
                <Carousel className="w-full">
                  <CarouselContent>
                    {IMAGES.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="relative w-full aspect-video">
                          <figure className="w-full h-full">
                            <Image
                              src={image}
                              alt={`Imagem ${index + 1}`}
                              fill
                              className="object-cover rounded-lg"
                              sizes="100vw"
                            />
                          </figure>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
