'use client';

import styles from './styles.module.scss';
import button from '../../styles/button.module.scss';
import { GiPistolGun, GiPoliceOfficerHead } from 'react-icons/gi';
import { PiCertificateFill, PiSecurityCameraFill } from 'react-icons/pi';
import { FaTruck } from 'react-icons/fa6';
import Subtitle from '@/components/Subtitle';
import { AiFillAlert } from 'react-icons/ai';
import { scrollToSection } from '@/utils/scrollToSection';
import CardFlip from '@/components/CardFlip';

const courses = [
  {
    icon: <GiPoliceOfficerHead />,
    title: 'Formação de vigilantes',
    subtitle: 'Excelência em Segurança Privada',
    description: 'Capacite-se em vigilância, segurança patrimonial, defesa pessoal e uso de armamento.',
    backDescription:
      'Formação profissional para atuar na segurança privada, com foco em vigilância patrimonial, segurança de estabelecimentos, defesa pessoal e uso de armamentos letais e não letais. Prepare-se para proteger pessoas e patrimônios com responsabilidade e técnica.',
  },
  {
    icon: <PiCertificateFill />,
    title: 'Reciclagem de vigilantes',
    subtitle: 'Atualização e Recapacitação em Segurança Privada',
    description: 'Reforce habilidades em vigilância, defesa pessoal e uso de armamentos.',
    backDescription:
      'Atualização obrigatória para vigilantes em atividade. Aulas teóricas e práticas com foco em vigilância patrimonial, defesa pessoal e uso de armamentos. Reforce suas habilidades e mantenha-se apto para atuar com excelência na segurança privada.',
  },
  {
    icon: <PiSecurityCameraFill />,
    title: 'Operador de CFTV',
    subtitle: 'Formação em Operação de Sistemas de Monitoramento',
    description: 'Aprenda a operar câmeras PTZ e equipamentos BOSCH com simulações práticas.',
    backDescription:
      'Capacitação para operar sistemas de vigilância eletrônica com câmeras PTZ e equipamentos BOSCH. Inclui aulas práticas com rádio comunicação, simulações de pronta resposta e controle por mesa KBD universal.',
  },
  {
    icon: <AiFillAlert />,
    title: 'Supervisão, Chefia e Segurança',
    subtitle: 'Liderança e Gestão em Segurança',
    description: 'Aprenda liderança, análise de risco e técnicas para supervisão eficiente.',
    backDescription:
      'Curso voltado à formação de líderes na segurança privada. Aborda análise de risco, planejamento estratégico, tipos de liderança, motivação de equipe, regras de segurança, manuseio e vistoria de armamentos.',
  },
  {
    icon: <GiPistolGun />,
    title: 'Escolta Armada',
    subtitle: 'Preparação para Operações de Escolta Armada',
    description: 'Capacite-se em prevenção, reação e uso de armamentos específicos.',
    backDescription:
      'Formação para atuar na proteção de cargas e valores com ações preventivas e reativas. Treinamento com pistola .380 e escopeta calibre 12, seguindo os padrões da segurança armada profissional.',
  },
  {
    icon: <FaTruck />,
    title: 'Transporte de Valores',
    subtitle: 'Formação Especializada em Transporte de Valores',
    description: 'Aprenda segurança, reação e práticas com armamentos e carro-forte.',
    backDescription:
      'Capacitação para atuar em carros-fortes com técnicas de prevenção e reação a ataques. Treinamento com pistola .380, escopeta calibre 12 e prática em veículo blindado.',
  },
];

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
          {courses.map((course, idx) => (
            <CardFlip
              key={idx}
              icon={course.icon}
              title={course.title}
              subtitle={course.subtitle}
              description={course.description}
              backDescription={course.backDescription}
            />
          ))}
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
