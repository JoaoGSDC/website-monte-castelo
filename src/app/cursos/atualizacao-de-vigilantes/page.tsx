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

export default function AtualizacaoDeVigilantesPage() {
  return (
    <>
      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h1>Atualização de Vigilantes</h1>
            <h3>Atualização e Recapacitação em Segurança Privada</h3>
          </div>

          <video width="320" height="240" controls={false} autoPlay muted loop>
            <source src="/videos/video-institucional.mp4" type="video/mp4" />
          </video>
        </div>

        <div className={styles.container}>
          <CoursesLeftBar />

          <div className={styles.content}>
            <Subtitle text="Sobre o curso" />
            <p>Reforce habilidades em vigilância, defesa pessoal e uso de armamentos.</p>
            <p>
              Atualização obrigatória para vigilantes em atividade. Aulas teóricas e práticas com foco em vigilância
              patrimonial, defesa pessoal e uso de armamentos. Reforce suas habilidades e mantenha-se apto para atuar
              com excelência na segurança privada.
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
