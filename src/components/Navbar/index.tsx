/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaMapLocationDot, FaRegMessage, FaBars, FaWhatsapp } from 'react-icons/fa6';
import { scrollToSection } from '@/utils/scrollToSection';
import { IoClose } from 'react-icons/io5';
import { useConfiguracoes } from '@/hooks/useConfiguracoes';
import { useApiCache } from '@/hooks/useApiCache';
import { ICourse } from '@/interfaces/course.interface';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { configuracoes, getWhatsAppUrl, formatPhone } = useConfiguracoes();
  
  const { data: coursesData } = useApiCache<ICourse[]>('/api/courses');
  const courses = coursesData?.map((course) => ({ slug: course.slug, title: course.title })) || [];

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

    // Buscar cursos será feito pelo useApiCache abaixo

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
            {configuracoes.social.whatsapp ? `Entre em contato: ${formatPhone(configuracoes.social.whatsapp)}` : 'Entre em contato'}
          </div>

          <div className={styles.address}>
            <FaMapLocationDot />
            {configuracoes.contato.endereco || 'R. Laurente Cia, 94, Jd. Porto Real IV, Limeira-SP'}
          </div>
        </div>

        <div className={styles.optionsContainer}>
          <div className={styles.socialMedia}>
            {configuracoes.social.instagram && (
              <a href={configuracoes.social.instagram} target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
            )}

            {configuracoes.social.facebook && (
              <a href={configuracoes.social.facebook} target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
            )}
          </div>

          {configuracoes.social.whatsapp && (
            <button>
              <a
                href={getWhatsAppUrl('Olá, gostaria de saber mais sobre os cursos fornecidos pela Academia Monte Castelo!')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp />
              </a>
            </button>
          )}
        </div>
      </div>

      <div className={styles.navbarBottom}>
        <div className={styles.optionsContainer}>
          <figure>
            {!scrolled ? (
              <Image
                src="/logo.png"
                alt="Academia Monte Castelo - Logo"
                fill
                priority
                sizes="(max-width: 768px) 120px, 180px"
              />
            ) : (
              <Image
                src="/logo-black.png"
                alt="Academia Monte Castelo - Logo"
                fill
                sizes="(max-width: 768px) 120px, 180px"
              />
            )}
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
                  {courses.map((course) => (
                    <Link key={course.slug} href={`/cursos/${course.slug}`}>
                      <p>{course.title}</p>
                    </Link>
                  ))}
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
            {configuracoes.social.whatsapp && (
              <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
                <FaWhatsapp />
              </a>
            )}

            {configuracoes.social.instagram && (
              <a href={configuracoes.social.instagram} target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
            )}

            {configuracoes.social.facebook && (
              <a href={configuracoes.social.facebook} target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
