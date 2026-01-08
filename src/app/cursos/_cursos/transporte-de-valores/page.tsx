/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Image from 'next/image';
import styles from '../styles.module.scss';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Subtitle from '@/components/Subtitle';
import CoursesLeftBar from '@/components/CoursesLeftBar';
import CourseInformation from '@/components/CourseInformation';

const IMAGES = [
  '/images/cursos-1.jpeg',
  '/images/cursos-2.jpeg',
  '/images/cursos-3.jpeg',
  '/images/cursos-4.jpeg',
  '/images/cursos-5.jpeg',
];

export default function TransporteDeValoresPage() {
  return (
    <>
      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h1>Transporte de valores</h1>
            <h3>Formação Especializada em Transporte de Valores</h3>
          </div>

          <video width="320" height="240" controls={false} autoPlay muted loop>
            <source src="/videos/video-institucional.mp4" type="video/mp4" />
          </video>
        </div>

        <div className={styles.container}>
          <CoursesLeftBar />

          <div className={styles.content}>
            <Subtitle text="Sobre o curso" />
            <p>Aprenda segurança, reação e práticas com armamentos e carro-forte.</p>
            <p>
              Capacitação para atuar em carros-fortes com técnicas de prevenção e reação a ataques. Treinamento com
              pistola .380, escopeta calibre 12 e prática em veículo blindado.
            </p>

            <CourseInformation />

            <Subtitle text="Documentos necessários" />
            <p>
              <ul>
                <li>Ser brasileiro nato ou naturalizado e com 21 anos completos</li>
                <li>Cópia da CNH ou CIN – (Carteira de Identidade Nacional) ATUALIZADA</li>
                <li>Cópia do Título de Eleitor ou e-Título</li>
                <li>Cópia do Comprovante de Endereço – emissão de no máximo 03 meses</li>
                <li>
                  Cópia do Histórico Escolar – ter concluído todas as etapas do ensino fundamental (ENSINO FUNDAMENTAL
                  COMPLETO)
                </li>
                <li>
                  Cópia da Reservista – (observar a necessidade de carimbo pelo Ministério da Defesa – Forças Armadas)
                  ou Certificado de Dispensa de Incorporação – CDI
                </li>
                <li>Cópia do Certificado do Curso de Formação de Vigilante (Frente e Verso)</li>
                <li>Certidão de Quitação Eleitoral</li>
                <li>Certidão de Crimes Eleitorais</li>
                <li>Certidão da Justiça Federal</li>
                <li>Certidão da Justiça Militar Federal</li>
                <li>Certidão da Justiça Militar Estadual</li>
                <li>Certidão de Execução Criminal</li>
                <li>Certidões de Distribuição e Ações Criminais</li>
                <li>
                  Exame Médico – Laudo original (validade de 12 meses com clínicas credenciadas pela Polícia Federal)
                </li>
                <li>Exame Psicológico – (validade de 12 meses com Psicólogo Credenciado pela Polícia Federal)</li>
              </ul>
            </p>

            {/* <div className={styles.carouselContainer}>
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
            </div> */}
          </div>
        </div>
      </main>
    </>
  );
}
