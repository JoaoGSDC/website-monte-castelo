'use client';

import React from 'react';
import styles from './styles.module.scss';
import button from '../../styles/button.module.scss';
import { FaArrowLeft, FaArrowRight, FaRegCirclePlay, FaStar } from 'react-icons/fa6';
import Modal from '@/components/Modal';
import useEmblaCarousel from 'embla-carousel-react';
import Highlights from '@/components/Highlights';

const Depoiments: React.FC = () => {
  const [openModal, setOpenModal] = React.useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, slidesToScroll: isMobile ? 1 : 2 });

  const depoiments = [
    {
      id: 1,
      text: 'Formado recentemente no curso de vigilante na academia Monte Castelo, com muita satisfação, só tenho a agradecer aos profissionais que prestam um trabalho com excelência! Professores realmente comprometido com os alunos e uma equipe de gestão top!',
      name: 'João Carlos de Oliveira',
      role: 'Aluno',
      imageUrl: 'https://academiamontecastelo.com.br/wp-content/uploads/2019/11/depoimeto-01-1.jpeg',
    },
    {
      id: 2,
      text: 'Hoje é um dia muito especial pra mim, pois alcancei o meu objetivo: A formação de vigilante na escola Monte Castelo. Estou  muito contente com as lições aprendidas e com os ótimos professores que a escola tem. A disciplina nos ensinamentos e o comprometimento de todos são pontos fortes da escola. Os outros colaboradores que atuam na administração também estão de parabéns pela eficiência e atenção que dão aos alunos. Sei que hoje, com os conhecimentos adquiridos, estou apta a desenvolver um bom trabalho na área de segurança. Fica aqui o meu muito obrigado a todos da equipe Monte Castelo pelos valores agregados na minha vida profissional e pessoal também.',
      name: 'Luciana Ribeiro de Oliveira Santos',
      role: 'Aluna',
      imageUrl: 'https://academiamontecastelo.com.br/wp-content/uploads/2019/11/depoimeto-02.jpeg',
    },
  ];

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  const items = [
    { image: '/images/depoimento-1.jpg', video: '/videos/depoimento-1.mp4' },
    { image: '/images/depoimento-2.jpg', video: '/videos/depoimento-2.mp4' },
    { image: '/images/depoimento-3.jpg', video: '/videos/depoimento-3.mp4' },
    { image: '/images/depoimento-4.jpg', video: '/videos/depoimento-4.mp4' },
  ];

  return (
    <>
      <section id="depoimentos" className={styles.container}>
        <div className={styles.video}>
          <button onClick={() => setOpenModal(true)}>
            <FaRegCirclePlay />
          </button>

          <h1>Conheça a Academia Monte Castelo</h1>

          <p>
            Estude na melhor escola de formação de vigilantes da região, com infraestrutura completa e instrutores
            credenciados pela Polícia Federal.
          </p>
        </div>

        <div className={styles.depoiments}>
          <div className={styles.title}>
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
                {depoiments.map((depoiment) => (
                  <div key={depoiment.id} className={styles.embla__slide}>
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
                          <img src={depoiment.imageUrl} alt="Descrição da imagem" />
                        </figure>

                        <div className={styles.depoimentInfo}>
                          <h4>{depoiment.name}</h4>
                          <p>{depoiment.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Highlights items={items} />

        <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
          <iframe
            id="iframe"
            src="https://www.youtube.com/embed/JosO2gnv0A8?si=4E0cx084YtZrLH_s"
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
