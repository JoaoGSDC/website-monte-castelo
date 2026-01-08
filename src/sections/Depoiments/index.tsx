'use client';

import React, { useState } from 'react';
import styles from './styles.module.scss';
import button from '../../styles/button.module.scss';
import { FaArrowLeft, FaArrowRight, FaRegCirclePlay, FaStar } from 'react-icons/fa6';
import Modal from '@/components/Modal';
import useEmblaCarousel from 'embla-carousel-react';
import Highlights from '@/components/Highlights';
import { useApiCache } from '@/hooks/useApiCache';
import Image from 'next/image';

interface DepoimentoVideo {
  video: string;
  capa: string;
}

interface VideosData {
  videoInstitucional?: string;
  depoimentos?: DepoimentoVideo[];
}

interface DepoimentoEscrito {
  _id: string;
  text: string;
  name: string;
  role: string;
  imageUrl: string;
}

const Depoiments: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, slidesToScroll: isMobile ? 1 : 2 });

  const { data: videosData, loading: videosLoading } = useApiCache<VideosData>('/api/videos');
  const { data: imagesData } = useApiCache<{
    home?: {
      depoimentsMainImage?: string;
      depoimentsTitleImage?: string;
    };
  }>('/api/imagens');
  const { data: depoimentosEscritos } = useApiCache<DepoimentoEscrito[]>('/api/depoimentos-escritos');

  const videoInstitucional = videosData?.videoInstitucional || '/videos/video-institucional.mp4';
  const depoimentosVideos = Array.isArray(videosData?.depoimentos) ? videosData.depoimentos : [];
  const depoimentsMainImage = imagesData?.home?.depoimentsMainImage || '/images/aula.jpg';
  const depoimentsTitleImage = imagesData?.home?.depoimentsTitleImage || '/images/background-5.jpg';
  const depoimentosEscritosList = Array.isArray(depoimentosEscritos) ? depoimentosEscritos : [];

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  const items = depoimentosVideos.map((depoimento) => ({
    image: depoimento.capa,
    video: depoimento.video,
  }));

  return (
    <>
      <section id="depoimentos" className={styles.container}>
        <div className={styles.video} style={{ backgroundImage: `url('${depoimentsMainImage}')` }}>
          <button onClick={() => setOpenModal(true)} aria-label="Assistir vídeo institucional da Academia Monte Castelo">
            <FaRegCirclePlay />
            <span className="sr-only">Reproduzir vídeo</span>
          </button>

          <h1>Conheça a Academia Monte Castelo</h1>

          <p>
            Estude na melhor escola de formação de vigilantes da região, com infraestrutura completa e instrutores
            credenciados pela Polícia Federal.
          </p>
        </div>

        <div className={styles.depoiments}>
          <div className={styles.title} style={{ backgroundImage: `url('${depoimentsTitleImage}')` }}>
            <h4>Depoimentos</h4>
            <h1>O que nossos alunos dizem sobre nós</h1>
          </div>

          <div className={styles.depoimentContainer}>
            <div className={styles.depoimentHeader}>
              <p>Ensino de excelência que forma profissionais verdadeiramente capacitados.</p>

              <div className={styles.buttons}>
                <button className={button.primaryVariant} onClick={scrollPrev}>
                  <FaArrowLeft />
                </button>
                <button className={button.primaryVariant} onClick={scrollNext}>
                  <FaArrowRight />
                </button>
              </div>
            </div>

            <div className={styles.depoimentContent} ref={emblaRef}>
              <div className={styles.embla__container}>
                {depoimentosEscritosList.length > 0 ? (
                  depoimentosEscritosList.map((depoiment) => (
                    <div key={depoiment._id} className={styles.embla__slide}>
                      <div className={styles.depoiment}>
                        <div className={styles.depoimentText}>
                          <div>
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                          </div>
                          {depoiment.text}
                        </div>

                        <div className={styles.depoimentFooter}>
                          <figure>
                            <Image
                              src={depoiment.imageUrl}
                              alt={`Foto de ${depoiment.name}, ${depoiment.role}`}
                              width={60}
                              height={60}
                              loading="lazy"
                              quality={75}
                            />
                          </figure>

                          <div className={styles.depoimentInfo}>
                            <h4>{depoiment.name}</h4>
                            <p>{depoiment.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.embla__slide}>
                    <div className={styles.depoiment}>
                      <div className={styles.depoimentText}>
                        <p>Nenhum depoimento escrito cadastrado no momento.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {!videosLoading && items.length > 0 && <Highlights items={items} />}

        <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
          <iframe
            id="iframe"
            src={videoInstitucional}
            title="Academia Monte Castelo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </Modal>
      </section>
    </>
  );
};

export default Depoiments;
