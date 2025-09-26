import Subtitle from '../Subtitle';
import styles from './styles.module.scss';

const CourseInformation = () => {
  return (
    <>
      <Subtitle text="Datas do Curso" />
      <p>
        Entre em contato com a Academia Monte Castelo, através do telefone{' '}
        <a className={styles.link} target="_blank" href="https://api.whatsapp.com/send?phone=5519974102924">
          (19) 97410-2924
        </a>{' '}
        e verifique as datas disponíveis.
      </p>
      <p>
        As inscrições devem ser realizadas pelo formulário{' '}
        <a className={styles.link} target="_blank" href="https://forms.gle/c3JLdbkw3S5rPWZ39">
          clicando aqui
        </a>{' '}
        com antecedência de 5 dias antes do início de cada curso (tempo necessário para verificação de toda
        documentação).
      </p>
    </>
  );
};

export default CourseInformation;
