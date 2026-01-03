'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './styles.module.scss';

export default function NovoCursoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    backDescription: '',
    video: '',
    images: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imagesArray = formData.images
        .split(',')
        .map((img) => img.trim())
        .filter((img) => img.length > 0);

      const response = await fetch('/api/admin/cursos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          images: imagesArray,
        }),
      });

      if (response.ok) {
        router.push('/admin/cursos');
      } else {
        const data = await response.json();
        alert(data.error || 'Erro ao criar curso');
      }
    } catch (error) {
      console.error('Erro ao criar curso:', error);
      alert('Erro ao criar curso');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  return (
    <div className={styles.container}>
      <h1>Novo Curso</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Título *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Ex: Formação de Vigilantes"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Slug *</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            placeholder="formacao-de-vigilantes"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Subtítulo *</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            required
            placeholder="Formação em Vigilância e Segurança Patrimonial"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Descrição (Frente) *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Descrição curta que aparece na frente do card"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Descrição (Verso) *</label>
          <textarea
            name="backDescription"
            value={formData.backDescription}
            onChange={handleChange}
            required
            rows={6}
            placeholder="Descrição completa que aparece no verso do card"
            className={styles.textarea}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Vídeo (URL)</label>
          <input
            type="url"
            name="video"
            value={formData.video}
            onChange={handleChange}
            placeholder="https://exemplo.com/video.mp4"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Imagens (URLs separadas por vírgula)</label>
          <textarea
            name="images"
            value={formData.images}
            onChange={handleChange}
            rows={3}
            placeholder="/images/curso-1.jpg, /images/curso-2.jpg"
          />
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={() => router.back()} className={styles.cancelButton}>
            Cancelar
          </button>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Curso'}
          </button>
        </div>
      </form>
    </div>
  );
}

