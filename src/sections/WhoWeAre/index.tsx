import Subtitle from '@/components/Subtitle';
import React from 'react';
import styles from './styles.module.scss';
import Image from 'next/image';
import { FaFortAwesome } from 'react-icons/fa6';

const WhoWeAre: React.FC = () => {
  return (
    <section id="quem-somos" className={styles.container}>
      <Subtitle text="Quem somos" />
      <h1>Quem nós somos?</h1>

      <div className={styles.content}>
        <div className={styles.image}>
          <div className={styles.form} />

          <figure>
            <Image src="/images/cursos-5.jpeg" alt="stand-de-tiro" layout="responsive" width={500} height={300} />
          </figure>
        </div>

        <div className={styles.circle}>
          <FaFortAwesome />
        </div>

        <div className={styles.textContent}>
          <h2>Academia Monte Castelo</h2>
          <p>
            A Academia Monte Castelo, autorizada pelo Departamento de Polícia Federal, forma vigilantes e profissionais
            de segurança privada com excelência desde 2014 em Limeira-SP.
          </p>
          <p>
            Contando com uma equipe especializada de instrutores credenciados pela Polícia Federal, com formação em
            academias militares e civis, além de especializações internacionais.
          </p>
          <ul>
            <li>Estande de tiro indoor automatizado</li>
            <li>Sala fitness e tatames para defesa pessoal</li>
            <li>Salas de aula e auditório climatizados</li>
            <li>CFTV com câmeras Bosch e sala de rádio comunicação</li>
            <li>Alojamentos masculinos e femininos</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
