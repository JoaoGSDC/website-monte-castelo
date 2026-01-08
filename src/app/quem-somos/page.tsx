"use client";

import Image from 'next/image';
import styles from './styles.module.scss';
import { useState, useEffect, useMemo } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useApiCache } from '@/hooks/useApiCache';

interface LibraryFile {
  _id: string;
  name: string;
  url: string;
}

export default function QuemSomosPage() {
  const [activeTab, setActiveTab] = useState<'institucional' | 'biblioteca' | 'sustentabilidade'>('institucional');
  const [selectedPdf, setSelectedPdf] = useState<string>('');

  const { data: libraryFiles, loading: loadingLibrary } = useApiCache<LibraryFile[]>('/api/biblioteca');
  const { data: imagesData } = useApiCache<{
    quemSomos?: {
      cover?: string;
      video?: string;
      carousel?: string[];
    };
  }>('/api/imagens');

  const libraryFilesList = useMemo(() => {
    return Array.isArray(libraryFiles) && libraryFiles.length > 0 ? libraryFiles : [];
  }, [libraryFiles]);

  const images = useMemo(() => ({
    cover: imagesData?.quemSomos?.cover || '/images/places/frente.jpg',
    video: imagesData?.quemSomos?.video || '/videos/video-1.mp4',
    carousel: Array.isArray(imagesData?.quemSomos?.carousel) ? imagesData.quemSomos.carousel : [],
  }), [imagesData]);

  // Set first PDF as selected when library loads
  useEffect(() => {
    if (libraryFilesList.length > 0 && !selectedPdf) {
      setSelectedPdf(libraryFilesList[0].url);
    }
  }, [libraryFilesList, selectedPdf]);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Quem Nós Somos</h1>
          <h2>Excelência em formação de profissionais de segurança</h2>
        </div>
        <div className={styles.headerImage}>
          <Image
            src={images.cover}
            alt="Equipe Monte Castelo"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      </header>

      <div className={styles.container}>
        <nav className={styles.tabs} aria-label="Seções">
          <button
            className={`${styles.tabButton} ${activeTab === 'institucional' ? styles.tabButtonActive : ''}`}
            onClick={() => setActiveTab('institucional')}
          >
            Institucional
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'biblioteca' ? styles.tabButtonActive : ''}`}
            onClick={() => setActiveTab('biblioteca')}
          >
            Biblioteca
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'sustentabilidade' ? styles.tabButtonActive : ''}`}
            onClick={() => setActiveTab('sustentabilidade')}
          >
            Sustentabilidade
          </button>
        </nav>

        {activeTab === 'institucional' && (
          <div className={styles.tabContent}>
            <section className={styles.aboutSection}>
              <div className={styles.aboutText}>
                <h3>Sobre a Academia Monte Castelo</h3>
                <p>
                  Fundada em 2014, a Academia Monte Castelo tornou-se referência na formação de vigilantes e profissionais
                  de segurança privada em Limeira-SP e toda a região. Nossa missão é capacitar com excelência, ética e
                  inovação, preparando nossos alunos para os desafios do mercado de trabalho e para atuarem com
                  responsabilidade e competência em diferentes segmentos da segurança privada.
                </p>
                <p>
                  Ao longo dos anos, investimos continuamente em infraestrutura moderna, tecnologia de ponta e atualização
                  de nossos métodos de ensino. Nossa equipe é composta por instrutores altamente qualificados e
                  credenciados, com vasta experiência prática e didática, garantindo um aprendizado sólido e alinhado às
                  exigências da Polícia Federal.
                </p>
                <p>
                  Oferecemos cursos completos e atualizados, com aulas teóricas e práticas, simuladores, estande de tiro
                  indoor automatizado, salas climatizadas, tatames para defesa pessoal e alojamentos confortáveis. Nosso
                  compromisso é proporcionar um ambiente seguro, acolhedor e motivador, onde cada aluno possa desenvolver
                  suas habilidades técnicas, comportamentais e éticas.
                </p>
                <p>
                  Acreditamos que a formação de um bom profissional vai além do conteúdo programático: envolve valores,
                  disciplina, respeito e a busca constante pela excelência. Por isso, acompanhamos de perto o
                  desenvolvimento de nossos alunos, oferecendo suporte individualizado e incentivando o crescimento pessoal
                  e profissional de cada um.
                </p>
                <h3>Corpo Docente — Missão e Compromisso com a Educação</h3>
                <p>
                  Nosso corpo docente é formado por instrutores e especialistas com ampla vivência operacional e acadêmica.
                  Temos o compromisso de ministrar aulas pautadas pela ética, atualização contínua e metodologias ativas,
                  promovendo um ambiente de aprendizagem inclusivo, seguro e orientado a resultados. A missão que nos guia é
                  transformar conhecimento em prática responsável, fortalecendo competências técnicas e socioemocionais para
                  a atuação profissional com excelência.
                </p>
              </div>

              <figure className={styles.aboutImage}>
                <video width={400} height={300} controls={false} autoPlay muted loop>
                  <source src={images.video} type="video/mp4" />
                  Seu navegador não suporta o elemento de vídeo.
                </video>
              </figure>
            </section>

            <section className={styles.valuesSection}>
              <h3>Nossos diferenciais</h3>
              <ul>
                <li>Estande de tiro indoor automatizado</li>
                <li>Sala fitness e tatames para defesa pessoal</li>
                <li>Salas de aula e auditório climatizados</li>
                <li>CFTV com câmeras Bosch e sala de rádio comunicação</li>
                <li>Alojamentos masculinos e femininos</li>
              </ul>
            </section>

            {images.carousel.length > 0 && (
              <div className={styles.carouselContainer}>
                <div className={styles.carousel}>
                  <Carousel className="w-full">
                    <CarouselContent>
                      {images.carousel.map((image, index) => (
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
            )}
          </div>
        )}

        {activeTab === 'biblioteca' && (
          <div className={styles.tabContent}>
            <section className={styles.library}>
              <div className={styles.libraryList}>
                <h3>Cartilhas e Materiais</h3>
                {loadingLibrary ? (
                  <div style={{ padding: '20px', textAlign: 'center' }}>Carregando...</div>
                ) : libraryFilesList.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center' }}>Nenhum material disponível</div>
                ) : (
                  <ul>
                    {libraryFilesList.map((file) => (
                      <li key={file._id}>
                        <button
                          className={`${styles.tabButton} ${selectedPdf === file.url ? styles.tabButtonActive : ''}`}
                          onClick={() => setSelectedPdf(file.url)}
                          aria-pressed={selectedPdf === file.url}
                        >
                          {file.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className={styles.pdfViewer}>
                {selectedPdf ? (
                  <object 
                    data={`${selectedPdf}#toolbar=1&navpanes=1&scrollbar=1`}
                    type="application/pdf"
                    className={styles.pdfObject}
                  >
                    <iframe 
                      title="Leitor de PDF" 
                      src={`${selectedPdf}#toolbar=1&navpanes=1&scrollbar=1`}
                      className={styles.pdfIframe}
                    />
                  </object>
                ) : (
                  <div className={styles.pdfPlaceholder}>Selecione um material para visualizar</div>
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'sustentabilidade' && (
          <div className={styles.tabContent}>
            <section className={styles.sustainability}>
              <h3>Nossa Sustentabilidade</h3>
              <div className={styles.sustainabilityGrid}>
                <div className={styles.sustainabilityCard}>
                  <h4>Painéis Solares</h4>
                  <p>
                    Investimos em geração de energia limpa por meio de painéis solares, reduzindo a emissão de carbono e
                    a dependência da rede elétrica convencional.
                  </p>
                </div>
                <div className={styles.sustainabilityCard}>
                  <h4>Motos Elétricas</h4>
                  <p>
                    Utilizamos motocicletas elétricas em operações internas e logísticas, diminuindo ruídos e emissões
                    de poluentes.
                  </p>
                </div>
                <div className={styles.sustainabilityCard}>
                  <h4>Ventilação e Segurança no Estande</h4>
                  <p>
                    Sistema de dutos de ventilação projetado para dispersão adequada de partículas (como chumbo),
                    garantindo qualidade do ar e conformidade com boas práticas de saúde e segurança.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
