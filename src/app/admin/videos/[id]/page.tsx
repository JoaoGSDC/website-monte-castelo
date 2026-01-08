'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from '../styles.module.scss';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import VideoInput from '@/components/admin/VideoInput';
import ImageInput from '@/components/admin/ImageInput';
import Link from 'next/link';

interface Depoimento {
  video: string;
  capa: string;
}

export default function EditDepoimentoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const index = parseInt(id);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Depoimento>({
    video: '',
    capa: '',
  });

  useEffect(() => {
    fetchDepoimento();
  }, []);

  const fetchDepoimento = async () => {
    try {
      const response = await fetch('/api/admin/videos');
      if (response.ok) {
        const config = await response.json();
        const depoimentos = Array.isArray(config.depoimentos) ? config.depoimentos : [];
        if (depoimentos[index]) {
          setFormData({
            video: depoimentos[index].video || '',
            capa: depoimentos[index].capa || '',
          });
        }
      }
    } catch (error) {
      console.error('Erro ao buscar depoimento:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.video) {
      alert('O vídeo é obrigatório');
      return;
    }

    setSaving(true);

    try {
      // Buscar todos os depoimentos
      const response = await fetch('/api/admin/videos');
      const config = await response.json();
      const depoimentos = Array.isArray(config.depoimentos) ? config.depoimentos : [];

      // Atualizar o depoimento específico
      depoimentos[index] = formData;

      // Salvar todos os depoimentos
      const saveResponse = await fetch('/api/admin/videos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...config, depoimentos }),
      });

      if (saveResponse.ok) {
        alert('Depoimento salvo com sucesso!');
        router.push('/admin/videos');
      } else {
        alert('Erro ao salvar depoimento');
      }
    } catch (error) {
      console.error('Erro ao salvar depoimento:', error);
      alert('Erro ao salvar depoimento');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Link href="/admin/videos" className={styles.backButton}>
            <FiArrowLeft />
            Voltar
          </Link>
          <h1>Editar Depoimento</h1>
          <p>Edite o depoimento {index + 1}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <VideoInput
              value={formData.video}
              onChange={(url) => setFormData({ ...formData, video: url })}
              label="Vídeo"
              required
              uploadEndpoint="/api/admin/cursos/upload-video"
              defaultValue="/videos/video-institucional.mp4"
            />
          </div>

          <div className={styles.formGroup}>
            <ImageInput
              value={formData.capa}
              onChange={(url) => setFormData({ ...formData, capa: url })}
              label="Capa"
              uploadEndpoint="/api/admin/imagens/upload-image"
              defaultValue="/images/depoimento-1.jpg"
            />
          </div>
        </div>

        <div className={styles.actionsSection}>
          <button type="submit" className={styles.submitButton} disabled={saving}>
            <FiSave />
            {saving ? 'Salvando...' : 'Salvar Depoimento'}
          </button>
        </div>
      </form>
    </div>
  );
}
