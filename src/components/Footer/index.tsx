'use client';

import styles from './styles.module.scss';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa6';
import { AiOutlineMail } from 'react-icons/ai';
import Link from 'next/link';
import { scrollToSection } from '@/utils/scrollToSection';
import { useConfiguracoes } from '@/hooks/useConfiguracoes';

const Footer: React.FC = () => {
  const { configuracoes, getWhatsAppUrl, formatPhone } = useConfiguracoes();

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
          <p>{configuracoes.contato.endereco || 'R. Laurente Cia, 94, Jd. Porto Real IV, Limeira-SP'}</p>
          <figure>
            <Image src="/images/map.png" alt="Localização da Academia Monte Castelo em Limeira-SP" fill loading="lazy" sizes="(max-width: 768px) 100vw, 50vw" />
          </figure>
        </div>

        <div className={styles.column}>
          <h3>Contatos</h3>
          {configuracoes.social.whatsapp && (
            <a href={getWhatsAppUrl()}>
              <p className={styles.option}>
                <FaWhatsapp />
                {formatPhone(configuracoes.social.whatsapp)}
              </p>
            </a>
          )}

          {configuracoes.contato.email && (
            <a href={`mailto:${configuracoes.contato.email}`}>
              <p className={styles.option}>
                <AiOutlineMail />
                {configuracoes.contato.email}
              </p>
            </a>
          )}

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
          <Image src="/logo.png" alt="Academia Monte Castelo - Logo" fill loading="lazy" sizes="(max-width: 768px) 120px, 180px" />
        </figure>

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
      </div>
    </footer>
  );
};

export default Footer;
