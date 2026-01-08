/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Image from 'next/image';
import styles from '../styles.module.scss';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Subtitle from '@/components/Subtitle';
import CoursesLeftBar from '@/components/CoursesLeftBar';
import CourseInformation from '@/components/CourseInformation';

const IMAGES = [
  '/images/cursos/curso-9.jpg',
  '/images/cursos/curso-10.jpg',
  '/images/cursos/curso-12.jpg',
  '/images/cursos/curso-13.jpg',
  '/images/cursos/curso-15.jpg',
  '/images/cursos/curso-16.jpg',
];

export default function SegurancaPessoalPage() {
  return (
    <>
      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h1>Extensão em Segurança Pessoal</h1>
            <h3>Formação em Vigilância e Segurança Patrimonial</h3>
          </div>

          <video width="320" height="240" controls={false} autoPlay muted loop>
            <source src="/videos/video-institucional.mp4" type="video/mp4" />
          </video>
        </div>

        <div className={styles.container}>
          <CoursesLeftBar />

          <div className={styles.content}>
            <Subtitle text="Sobre o curso" />
            <p>Domine técnicas avançadas de vigilância e proteção patrimonial para atuar com excelência no setor.</p>
            <p>
              O curso de extensão em Segurança Pessoal Privada oferece formação aprofundada em estratégias de proteção
              de indivíduos. Inclui planejamento de segurança, escolta em diferentes situações e uso de armamentos,
              garantindo alta performance no setor.
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
                  Cópia da Reservista – (observar a necessidade de carimbo pelo Ministério da Defesa – Forças Armadas)
                  ou Certificado de Dispensa de Incorporação – CDI
                </li>
                <li>Cópia do Certificado do Curso de Formação de Vigilante (Frente e Verso)</li>
                <li>Cópia do Certificado do Curso de Extensão em Segurança Pessoal (Frente e Verso)</li>
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
