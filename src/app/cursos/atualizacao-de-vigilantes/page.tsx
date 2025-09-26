import React from 'react';
import Image from 'next/image';
import styles from '../styles.module.scss';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Subtitle from '@/components/Subtitle';
import CoursesLeftBar from '@/components/CoursesLeftBar';
import CourseInformation from '@/components/CourseInformation';

const IMAGES = [
  '/images/cursos/curso-4.jpg',
  '/images/cursos-3.jpeg',
  '/images/cursos/curso-6.jpg',
  '/images/cursos/curso-7.jpg',
  '/images/cursos/curso-8.jpg',
];

export default function AtualizacaoDeVigilantesPage() {
  return (
    <>
      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h1>Atualização de Vigilantes (Antiga Reciclagem)</h1>
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
              patrimonial, defesa pessoal e uso de armamentos. Reforce suas habilidades e mantenha-se apto a atuar com
              excelência na segurança privada.
            </p>

            <CourseInformation />

            <Subtitle text="Documentos necessários" />
            <p>
              <ul>
                <li>Ser brasileiro nato ou naturalizado e com 21 anos completos</li>
                <li>Cópia da Cédula de Identidade – RG</li>
                <li>Cópia do CPF (antigo CIC)</li>
                <li>Cópia do Título de Eleitor</li>
                <li>Cópia do Comprovante de Endereço – emissão de no máximo 03 meses</li>
                <li>
                  Cópia da Reservista – (observar a necessidade de carimbo pelo Ministério da Defesa – Forças Armadas)
                  ou Certificado de Dispensa de Incorporação – CDI
                </li>
                <li>Certificado do Curso de Formação de Vigilantes</li>
                <li>Certidão de Quitação Eleitoral</li>
                <li>Certidão de Crimes Eleitorais</li>
                <li>Certidão da Justiça Federal</li>
                <li>Certidão da Justiça Militar da União</li>
                <li>Certidão da Justiça Militar Estadual</li>
                <li>Certidão de Execução Criminal</li>
                <li>Certidões de Distribuição e Ações Criminais</li>
                <li>Exame Médico – Laudo original (poderá ser feito da Escola Paulista)</li>
                <li>Exame Psicológico – (validade de 12 meses com Psicólogo Credenciado pela Polícia Federal)</li>
                <li>
                  Link com endereços e telefones do Estado de SP:
                  <a
                    href="https://www.gov.br/pf/pt-br/assuntos/armas/psicologos/psicologos-crediciados"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Clique aqui
                  </a>
                </li>
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
