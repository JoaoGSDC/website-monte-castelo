'use client';

import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { FiSave } from 'react-icons/fi';

interface VideoConfig {
  videoInstitucional: string;
  depoimento1: string;
  depoimento2: string;
  depoimento3: string;
  depoimento4: string;
  video1: string;
}

export default function VideosPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<VideoConfig>({
    videoInstitucional: '',
    depoimento1: '',
    depoimento2: '',
    depoimento3: '',
    depoimento4: '',
    video1: '',
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/admin/videos');
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      }
    } catch (error) {
      console.error('Erro ao buscar vídeos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/videos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Vídeos salvos com sucesso!');
      } else {
        alert('Erro ao salvar vídeos');
      }
    } catch (error) {
      console.error('Erro ao salvar vídeos:', error);
      alert('Erro ao salvar vídeos');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  const videoFields = [
    { key: 'videoInstitucional', label: 'Vídeo Institucional' },
    { key: 'depoimento1', label: 'Depoimento 1' },
    { key: 'depoimento2', label: 'Depoimento 2' },
    { key: 'depoimento3', label: 'Depoimento 3' },
    { key: 'depoimento4', label: 'Depoimento 4' },
    { key: 'video1', label: 'Vídeo 1' },
  ] as const;

  return (
    <div className={styles.container}>
      <h1>Gerenciar Vídeos</h1>
      <p className={styles.subtitle}>Altere os vídeos do website</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        {videoFields.map((field) => (
          <div key={field.key} className={styles.formGroup}>
            <label>{field.label}</label>
            <input
              type="url"
              name={field.key}
              value={formData[field.key]}
              onChange={handleChange}
              placeholder="/videos/video.mp4"
            />
            {formData[field.key] && (
              <div className={styles.preview}>
                <video src={formData[field.key]} controls style={{ maxWidth: '100%', maxHeight: '200px' }} />
              </div>
            )}
          </div>
        ))}

        <div className={styles.actions}>
          <button type="submit" className={styles.submitButton} disabled={saving}>
            <FiSave />
            {saving ? 'Salvando...' : 'Salvar Vídeos'}
          </button>
        </div>
      </form>
    </div>
  );
}

