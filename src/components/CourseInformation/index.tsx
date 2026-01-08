'use client';

import Subtitle from '../Subtitle';
import styles from './styles.module.scss';
import { useConfiguracoes } from '@/hooks/useConfiguracoes';

interface CourseInformationProps {
  content?: string;
}

const CourseInformation = ({ content }: CourseInformationProps) => {
  const { configuracoes, getWhatsAppUrl, formatPhone } = useConfiguracoes();

  // Se não houver conteúdo, usa o conteúdo padrão (para compatibilidade com páginas estáticas)
  if (!content) {
    return (
      <>
        <Subtitle text="Informações do Curso" />
        {configuracoes.social.whatsapp ? (
          <p>
            Entre em contato com a Academia Monte Castelo, através do telefone{' '}
            <a className={styles.link} target="_blank" href={getWhatsAppUrl()} rel="noopener noreferrer">
              {formatPhone(configuracoes.social.whatsapp)}
            </a>{' '}
            e verifique as datas disponíveis.
          </p>
        ) : (
          <p>
            Entre em contato com a Academia Monte Castelo para verificar as datas disponíveis.
          </p>
        )}
        <p>
          As inscrições devem ser realizadas pelo formulário{' '}
          <a className={styles.link} target="_blank" href="https://forms.gle/c3JLdbkw3S5rPWZ39" rel="noopener noreferrer">
            clicando aqui
          </a>{' '}
          com antecedência de 5 dias antes do início de cada curso (tempo necessário para verificação de toda
          documentação).
        </p>
      </>
    );
  }

  return (
    <>
      <Subtitle text="Informações do Curso" />
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </>
  );
};

export default CourseInformation;
