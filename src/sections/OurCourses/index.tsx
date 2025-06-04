'use client';

import styles from './styles.module.scss';
import button from '../../styles/button.module.scss';
import { GiPistolGun, GiPoliceOfficerHead } from 'react-icons/gi';
import { PiCertificateFill, PiSecurityCameraFill } from 'react-icons/pi';
import { FaTruck } from 'react-icons/fa6';
import Link from 'next/link';
import Subtitle from '@/components/Subtitle';
import { AiFillAlert } from 'react-icons/ai';
import { scrollToSection } from '@/utils/scrollToSection';

export default function OurCourses() {
  return (
    <section id="cursos" className={styles.container}>
      <div className={styles.content}>
        <div className={styles.textContent}>
          <Subtitle text="Nossos cursos" />

          <div className={styles.title}>
            <h1>Conheça nossos cursos</h1>

            <p>
              Oferecemos cursos especializados para formar vigilantes altamente capacitados, preparados para atuar com
              excelência e profissionalismo. Nossa missão é garantir a sua qualificação com treinamento completo e
              atualizado, seguindo todas as normas de segurança.
            </p>
          </div>
        </div>

        <div className={styles.courses}>
          <div className={styles.course}>
            <div className={styles.image}>
              <GiPoliceOfficerHead />
              <span>☆</span>
            </div>

            <div className={styles.courseContent}>
              <h4>Excelência em Segurança Privada</h4>
              <h1>Formação de vigilantes</h1>
              <hr />
              <p>Capacite-se em vigilância, segurança patrimonial, defesa pessoal e uso de armamento.</p>
              <button onClick={() => scrollToSection('contato')}>
                <Link href="#">Ver mais +</Link>
              </button>
            </div>
          </div>

          <div className={styles.course}>
            <div className={styles.image}>
              <PiCertificateFill />
              <span>☆</span>
            </div>

            <div className={styles.courseContent}>
              <h4>Atualização e Recapacitação em Segurança Privada</h4>
              <h1>Reciclagem de vigilantes</h1>
              <hr />
              <p>Reforce habilidades em vigilância, defesa pessoal e uso de armamentos.</p>
              <button onClick={() => scrollToSection('contato')}>
                <Link href="#">Ver mais +</Link>
              </button>
            </div>
          </div>

          <div className={styles.course}>
            <div className={styles.image}>
              <PiSecurityCameraFill />
              <span>☆</span>
            </div>

            <div className={styles.courseContent}>
              <h4>Formação em Operação de Sistemas de Monitoramento</h4>
              <h1>Operador de CFTV</h1>
              <hr />
              <p>Aprenda a operar câmeras PTZ e equipamentos BOSCH com simulações práticas.</p>
              <button onClick={() => scrollToSection('contato')}>
                <Link href="#">Ver mais +</Link>
              </button>
            </div>
          </div>

          <div className={styles.course}>
            <div className={styles.image}>
              <AiFillAlert />
              <span>☆</span>
            </div>

            <div className={styles.courseContent}>
              <h4>Liderança e Gestão em Segurança</h4>
              <h1>Supervisão, Chefia e Segurança</h1>
              <hr />
              <p>Aprenda liderança, análise de risco e técnicas para supervisão eficiente.</p>
              <button onClick={() => scrollToSection('contato')}>
                <Link href="#">Ver mais +</Link>
              </button>
            </div>
          </div>

          <div className={styles.course}>
            <div className={styles.image}>
              <GiPistolGun />
              <span>☆</span>
            </div>
            <div className={styles.courseContent}>
              <h4>Preparação para Operações de Escolta Armada</h4>
              <h1>Escolta Armada</h1>
              <hr />
              <p>Capacite-se em prevenção, reação e uso de armamentos específicos.</p>
              <button onClick={() => scrollToSection('contato')}>
                <Link href="#">Ver mais +</Link>
              </button>
            </div>
          </div>

          <div className={styles.course}>
            <div className={styles.image}>
              <FaTruck />
              <span>☆</span>
            </div>
            <div className={styles.courseContent}>
              <h4>Formação Especializada em Transporte de Valores</h4>
              <h1>Transporte de Valores</h1>
              <hr />
              <p>Aprenda segurança, reação e práticas com armamentos e carro-forte.</p>
              <button onClick={() => scrollToSection('contato')}>
                <Link href="#">Ver mais +</Link>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.contact}>
        <h2>Seja um profissional destacado</h2>
        <h1>{`(19) 9 7410-2924`}</h1>
        <button className={button.primaryAlternative} onClick={() => scrollToSection('contato')}>
          saiba mais
        </button>
      </div>
    </section>
  );
}
