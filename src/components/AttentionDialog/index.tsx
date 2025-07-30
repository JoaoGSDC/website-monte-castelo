'use client';

import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import Link from 'next/link';

export default function AttentionDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setOpen(true);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setOpen(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('mouseout', handleMouseLeave);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);

  return (
    <Dialog className={styles.container} open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <h1>Espera um pouco!</h1>
          <h3>Entre em contato com a nossa equipe para esclarecer suas dúvidas.</h3>
        </DialogHeader>

        <Link
          href="https://forms.gle/c3JLdbkw3S5rPWZ39"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.button}
        >
          ENTRAR EM CONTATO
        </Link>
      </DialogContent>
    </Dialog>
  );
}
