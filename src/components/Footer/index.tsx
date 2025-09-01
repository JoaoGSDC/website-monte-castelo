/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import styles from './styles.module.scss';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa6';
import { AiOutlineMail } from 'react-icons/ai';
import Link from 'next/link';
import { scrollToSection } from '@/utils/scrollToSection';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.column}>
          <h3>Sobre nós</h3>
          <p>
            A Academia Monte Castelo, autorizada pelo Departamento de Polícia Federal, forma vigilantes e profissionais
            de segurança privada com excelência desde 2014 em Limeira-SP.
          </p>
          <p>
            Contando com uma equipe especializada de instrutores credenciados pela Polícia Federal, com formação em
            academias militares e civis, além de especializações internacionais.
          </p>
        </div>

        <div className={styles.column}>
          <h3>Endereço</h3>
          <p>R. Laurente Cia, 94, Jd. Porto Real IV, Limeira-SP</p>
          <figure>
            <Image src="/images/map.png" alt="map" fill />
          </figure>
        </div>

        <div className={styles.column}>
          <h3>Contatos</h3>
          <a href="https://api.whatsapp.com/send?phone=5519974102924">
            <p className={styles.option}>
              <FaWhatsapp />
              (19) 9 7410-2924
            </p>
          </a>

          <a href="mailto:contato@academiamontecastelo.com.br">
            <p className={styles.option}>
              <AiOutlineMail />
              contato@academiamontecastelo.com.br
            </p>
          </a>

          <div className={styles.column} style={{ marginTop: 32 }}>
            <h3>Horário de funcionamento</h3>
            <p>Segunda a sexta: 6h às 22h</p>
            <p>Sábado: 8h às 12h</p>
          </div>
        </div>

        <div className={styles.column}>
          <h3>Navegação</h3>

          <Link href="/">
            <p className={styles.option}>INÍCIO</p>
          </Link>

          <p className={styles.option} onClick={() => scrollToSection('quem-somos')}>
            QUEM SOMOS
          </p>

          <p className={styles.option} onClick={() => scrollToSection('cursos')}>
            CURSOS
          </p>

          <Link href="/blog">
            <p className={styles.option}>BLOG</p>
          </Link>

          <p className={styles.option} onClick={() => scrollToSection('depoimentos')}>
            DEPOIMENTOS
          </p>

          <p className={styles.option} onClick={() => scrollToSection('contato')}>
            CONTATO
          </p>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} Academia Monte Castelo. All rights reserved.</p>

        <figure>
          <Image src="/logo.png" alt="logo" fill />
        </figure>

        <div className={styles.socialMedia}>
          <a href="https://www.instagram.com/academiamontecastelooficial/" target="_blank">
            <FaInstagram />
          </a>

          <a href="https://www.facebook.com/academiamontecastelo" target="_blank">
            <FaFacebook />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
