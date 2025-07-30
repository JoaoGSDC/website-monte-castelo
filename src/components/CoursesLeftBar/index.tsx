import Link from 'next/link';
import { RiPoliceBadgeFill } from 'react-icons/ri';
import styles from './styles.module.scss';
import Image from 'next/image';

const CoursesLeftBar = () => {
  return (
    <aside className={styles.leftBarContainer}>
      <ul className={styles.leftBar}>
        <li>
          <Link href="/cursos/formacao-de-vigilantes">Formação de Vigilantes</Link>
        </li>
        <li>
          <Link href="/cursos/atualizacao-de-vigilantes">Atualização de Vigilantes</Link>
        </li>
        <li>
          <Link href="/cursos/operador-de-cftv">Operador de CFTV</Link>
        </li>
        <li>
          <Link href="/cursos/supervisao-chefia-e-seguranca">Supervisão, Chefia e Segurança</Link>
        </li>
        <li>
          <Link href="/cursos/escolta-armada">Escolta Armada</Link>
        </li>
        <li>
          <Link href="/cursos/transporte-de-valores">Transporte de Valores</Link>
        </li>
      </ul>

      <div className={styles.infoContainer}>
        <div className={styles.icon}>
          <RiPoliceBadgeFill />
        </div>

        <h1>Formar com Excelência é nosso compromisso</h1>
        <p>Quer ser um profissional de segurança preparado?</p>

        <a
          href="https://forms.gle/c3JLdbkw3S5rPWZ39"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.contactLink}
        >
          Entre em contato
        </a>

        <figure>
          <Image src="/images/blog-cover.png" alt="background" width={400} height={200} />
        </figure>
      </div>
    </aside>
  );
};

export default CoursesLeftBar;
