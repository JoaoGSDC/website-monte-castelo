import { IoClose } from 'react-icons/io5';
import styles from './styles.module.scss';

import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  color?: string;
}

const Modal = ({ isOpen, onClose, children, color = '#ffffff' }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <IoClose size={24} fill={color} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
