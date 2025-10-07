'use client';

import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import button from '../../styles/button.module.scss';

import Modal from '../Modal';
import Link from 'next/link';
import Subtitle from '../Subtitle';
import Image from 'next/image';

const CoursesListModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const displayModal = sessionStorage.getItem('courses-list');

    if (displayModal && displayModal == '0') {
      return;
    }

    document.body.style.overflow = 'hidden';
    setIsOpen(true);
  }, []);

  const onClose = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';

    sessionStorage.setItem('courses-list', '0');
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} color="var(--text-primary)">
      <div className={styles.container}>
        <figure className={styles.logo}>
          <Image src="/logo-black.png" alt="logo" fill />
        </figure>

        <Subtitle text="Confira nossos cursos" />

        <ul className={styles.leftBar}>
          <li>
            <Link href="/cursos/armas-nao-letais" onClick={onClose}>
              Armas não letais
            </Link>
          </li>

          <li>
            <Link href="/cursos/atualizacao-de-vigilantes" onClick={onClose}>
              Atualização de Vigilantes
            </Link>
          </li>

          <li>
            <Link href="/cursos/atualizacao-escolta-armada" onClick={onClose}>
              Atualização Escolta Armada
            </Link>
          </li>

          <li>
            <Link href="/cursos/atualizacao-transporte-de-valores" onClick={onClose}>
              Atualização Transporte de Valores
            </Link>
          </li>

          <li>
            <Link href="/cursos/atualizacao-vssp" onClick={onClose}>
              Atualização Segurança Pessoal
            </Link>
          </li>

          <li>
            <Link href="/cursos/escolta-armada" onClick={onClose}>
              Escolta Armada
            </Link>
          </li>

          <li>
            <Link href="/cursos/vssp" onClick={onClose}>
              Extensão em Segurança Pessoal
            </Link>
          </li>

          <li>
            <Link href="/cursos/formacao-de-vigilantes" onClick={onClose}>
              Formação de Vigilantes
            </Link>
          </li>

          <li>
            <Link href="/cursos/operador-de-cftv" onClick={onClose}>
              Operador de CFTV
            </Link>
          </li>

          <li>
            <Link href="/cursos/supervisao-chefia-e-seguranca" onClick={onClose}>
              Supervisão, Chefia e Segurança
            </Link>
          </li>

          <li>
            <Link href="/cursos/transporte-de-valores" onClick={onClose}>
              Transporte de Valores
            </Link>
          </li>
        </ul>

        <button className={button.primaryVariant} type="button" onClick={onClose}>
          Conheça a Monte Castelo
        </button>
      </div>
    </Modal>
  );
};

export default CoursesListModal;
