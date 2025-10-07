'use client';

import styles from './styles.module.scss';
import button from '../../styles/button.module.scss';
import { GiPistolGun, GiPoliceOfficerHead } from 'react-icons/gi';
import { PiCertificateFill, PiSecurityCameraFill } from 'react-icons/pi';
import { FaHouseUser, FaTruck } from 'react-icons/fa6';
import Subtitle from '@/components/Subtitle';
import { AiFillAlert, AiFillThunderbolt } from 'react-icons/ai';
import { scrollToSection } from '@/utils/scrollToSection';
import CardFlip from '@/components/CardFlip';

const courses = [
  {
    icon: <AiFillThunderbolt />,
    title: 'Armas não letais',
    subtitle: 'Formação Especializada em Armas Não Letais',
    description: 'Aprenda técnicas de contenção e uso responsável de armamentos não letais.',
    backDescription:
      'Capacitação prática para o uso de armamentos não letais, como spray de pimenta, tasers e bastões retráteis. Enfoque em técnicas de contenção, controle de distúrbios e atuação preventiva com segurança.',
  },
  {
    icon: <PiCertificateFill />,
    title: 'Atualização de Vigilantes',
    subtitle: 'Atualização e Recapacitação em Segurança Privada',
    description: 'Reforce habilidades em vigilância, defesa pessoal e uso de armamentos.',
    backDescription:
      'Atualização obrigatória para vigilantes em atividade. Aulas teóricas e práticas com foco em vigilância patrimonial, defesa pessoal e uso de armamentos. Reforce suas habilidades e mantenha-se apto a atuar com excelência na segurança privada.',
  },
  {
    icon: <PiCertificateFill />,
    title: 'Atualização Escolta Armada',
    subtitle: 'Recapacitação em Operações de Escolta Armada',
    description: 'Mantenha-se atualizado em prevenção, reação e uso de armamentos em escoltas.',
    backDescription:
      'Treinamento de atualização para profissionais de escolta armada. Enfoque em técnicas preventivas, reação a ataques e prática com armamentos específicos, garantindo atuação eficiente e dentro das normas da segurança privada.',
  },
  {
    icon: <PiCertificateFill />,
    title: 'Atualização Transporte de Valores',
    subtitle: 'Recapacitação em Operações de Transporte de Valores',
    description:
      'Atualize seus conhecimentos em segurança e reações operacionais, com foco em práticas reais de transporte de valores.',
    backDescription:
      'Treinamento voltado para profissionais que já atuam na área e buscam reciclagem em técnicas de prevenção, resposta a incidentes e manejo seguro de armamentos. Inclui exercícios com pistola .380, escopeta calibre 12 e simulações em veículo blindado.',
  },
  {
    icon: <PiCertificateFill />,
    title: 'Atualização Segurança Pessoal',
    subtitle: 'Recapacitação em Segurança Pessoal Privada',
    description: 'Aprimore sua atuação em proteção de pessoas e segurança pessoal.',
    backDescription:
      'Curso obrigatório de atualização em Segurança Pessoal Privada. Revisão de técnicas de escolta de pessoas, prevenção de riscos, planejamento de rotas e uso adequado de armamentos para manter a excelência no serviço.',
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
    icon: <FaHouseUser />,
    title: 'Extensão em Segurança Pessoal',
    subtitle: 'Especialização em Segurança Pessoal Privada',
    description: 'Domine técnicas avançadas de proteção de pessoas em diferentes cenários.',
    backDescription:
      'O curso de extensão em Segurança Pessoal Privada oferece formação aprofundada em estratégias de proteção de indivíduos. Inclui planejamento de segurança, escolta em diferentes situações e uso de armamentos, garantindo alta performance no setor.',
  },
  {
    icon: <GiPoliceOfficerHead />,
    title: 'Formação de Vigilantes',
    subtitle: 'Excelência em Segurança Privada',
    description: 'Capacite-se em vigilância, segurança patrimonial, defesa pessoal e uso de armamento.',
    backDescription:
      'Formação profissional para atuar na segurança privada, com foco em vigilância patrimonial, segurança de estabelecimentos, defesa pessoal e uso de armamentos letais e não letais. Prepare-se para proteger pessoas e patrimônios com responsabilidade e técnica.',
  },
  {
    icon: <PiSecurityCameraFill />,
    title: 'Operador de CFTV',
    subtitle: 'Formação em Operação de Sistemas de Monitoramento',
    description: 'Aprenda a operar câmeras PTZ e sistemas de vigilância eletrônica.',
    backDescription:
      'Capacitação para operar sistemas de vigilância eletrônica com câmeras PTZ e equipamentos BOSCH. Inclui aulas práticas com rádio comunicação, simulações de pronta resposta e controle por mesa KBD universal.',
  },
  {
    icon: <AiFillAlert />,
    title: 'Supervisão, Chefia e Segurança',
    subtitle: 'Liderança e Gestão em Segurança Privada',
    description: 'Aprenda liderança, análise de risco e técnicas de supervisão eficiente.',
    backDescription:
      'Curso voltado à formação de líderes na segurança privada. Aborda análise de risco, planejamento estratégico, tipos de liderança, motivação de equipe, regras de segurança, manuseio e vistoria de armamentos.',
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
