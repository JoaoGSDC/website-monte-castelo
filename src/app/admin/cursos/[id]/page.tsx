'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from '../novo/styles.module.scss';
import { ICourse } from '@/interfaces/course.interface';

export default function EditarCursoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    backDescription: '',
    video: '',
    images: '',
  });

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/admin/cursos/${id}`);
      if (response.ok) {
        const course: ICourse = await response.json();
        setFormData({
          title: course.title || '',
          slug: course.slug || '',
          subtitle: course.subtitle || '',
          description: course.description || '',
          backDescription: course.backDescription || '',
          video: course.video || '',
          images: course.images?.join(', ') || '',
        });
      }
    } catch (error) {
      console.error('Erro ao buscar curso:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const imagesArray = formData.images
        .split(',')
        .map((img) => img.trim())
        .filter((img) => img.length > 0);

      const response = await fetch(`/api/admin/cursos/${id}`, {
        method: 'PUT',
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
        alert(data.error || 'Erro ao atualizar curso');
      }
    } catch (error) {
      console.error('Erro ao atualizar curso:', error);
      alert('Erro ao atualizar curso');
    } finally {
      setSaving(false);
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

  if (loading) {
    return <div className={styles.container}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Editar Curso</h1>
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
          <button type="submit" className={styles.submitButton} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}

