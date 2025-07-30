/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaMapLocationDot, FaRegMessage, FaBars, FaWhatsapp } from 'react-icons/fa6';
import { scrollToSection } from '@/utils/scrollToSection';
import { IoClose } from 'react-icons/io5';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    setIsMobile(window.innerWidth <= 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    handleResize(); // Check initial screen size

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.navbarTop}>
        <div className={styles.optionsContainer}>
          <div className={styles.contact}>
            <FaRegMessage />
            {`Entre em contato: (19) 9 7410-2924`}
          </div>

          <div className={styles.address}>
            <FaMapLocationDot />
            {`R. Laurente Cia, 94, Jd. Porto Real IV, Limeira-SP`}
          </div>
        </div>

        <div className={styles.optionsContainer}>
          <div className={styles.socialMedia}>
            <a href="https://www.instagram.com/academiamontecastelooficial/" target="_blank">
              <FaInstagram />
            </a>

            <a href="https://www.facebook.com/academiamontecastelo" target="_blank">
              <FaFacebook />
            </a>
          </div>

          <button>
            <a
              href="https://wa.me/5519974102924?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20os%20cursos%20fornecidos%20pela%20Academia%20Monte%20Castelo!"
              target="_blank"
            >
              <FaWhatsapp />
            </a>
          </button>
        </div>
      </div>

      <div className={styles.navbarBottom}>
        <div className={styles.optionsContainer}>
          <figure>
            {!scrolled ? <Image src="/logo.png" alt="logo" fill /> : <Image src="/logo-black.png" alt="logo" fill />}
          </figure>

          {isMobile ? (
            <button className={styles.hamburger} onClick={toggleMenu}>
              {menuOpen ? null : <FaBars />}
            </button>
          ) : (
            <>
              <Link href="/">
                <p>INÍCIO</p>
              </Link>

              <div className={styles.dropdown}>
                <a onClick={() => scrollToSection('quem-somos')}>
                  <p>SOBRE NÓS</p>
                </a>

                <div className={styles.dropdownContent}>
                  <Link href="/quem-somos">
                    <p>Quem somos</p>
                  </Link>
                </div>
              </div>

              <div className={styles.dropdown}>
                <a onClick={() => scrollToSection('cursos')}>
                  <p>CURSOS</p>
                </a>

                <div className={styles.dropdownContent}>
                  <Link href="/cursos/formacao-de-vigilantes">
                    <p>Formação de vigilantes</p>
                  </Link>

                  <Link href="/cursos/atualizacao-de-vigilantes">
                    <p>Atualização de vigilantes</p>
                  </Link>

                  <Link href="/cursos/operador-de-cftv">
                    <p>Operador de CFTV</p>
                  </Link>

                  <Link href="/cursos/supervisao-chefia-e-seguranca">
                    <p>Supervisão, Chefia e Segurança</p>
                  </Link>

                  <Link href="/cursos/escolta-armada">
                    <p>Escolta Armada</p>
                  </Link>

                  <Link href="/cursos/transporte-de-valores">
                    <p>Transporte de Valores</p>
                  </Link>
                </div>
              </div>

              <Link href="/blog">
                <p>BLOG</p>
              </Link>

              <a onClick={() => scrollToSection('depoimentos')}>
                <p>DEPOIMENTOS</p>
              </a>

              <a onClick={() => scrollToSection('contato')}>
                <p>CONTATO</p>
              </a>
            </>
          )}
        </div>
      </div>

      {isMobile && menuOpen && (
        <div className={styles.mobileMenu}>
          <button className={styles.closeMenu} onClick={toggleMenu}>
            <IoClose />
          </button>

          <Link href="/" onClick={toggleMenu}>
            <p>INÍCIO</p>
          </Link>

          <Link
            onClick={() => {
              toggleMenu();
            }}
            href="/quem-somos"
          >
            <p>QUEM SOMOS</p>
          </Link>

          <Link
            onClick={() => {
              toggleMenu();
            }}
            href="/cursos/formacao-de-vigilantes"
          >
            <p>CURSOS</p>
          </Link>

          <Link href="/blog" onClick={toggleMenu}>
            <p>BLOG</p>
          </Link>

          <a
            onClick={() => {
              scrollToSection('depoimentos');
              toggleMenu();
            }}
          >
            <p>DEPOIMENTOS</p>
          </a>

          <a
            onClick={() => {
              scrollToSection('contato');
              toggleMenu();
            }}
          >
            <p>CONTATO</p>
          </a>

          <div className={styles.socialMedia}>
            <a href="https://api.whatsapp.com/send?phone=5519974102924" target="_blank">
              <FaWhatsapp />
            </a>

            <a href="https://www.instagram.com/academiamontecastelooficial/" target="_blank">
              <FaInstagram />
            </a>

            <a href="https://www.facebook.com/academiamontecastelo" target="_blank">
              <FaFacebook />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
