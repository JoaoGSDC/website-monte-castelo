'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './styles.module.scss';
import VideoInput from '@/components/admin/VideoInput';
import ImagesCarouselInput from '@/components/admin/ImagesCarouselInput';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function NovoCursoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    backDescription: '',
    icon: '',
    video: '',
    images: [] as string[],
    aboutCourse: '',
    courseInformation: '',
    requiredDocuments: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/cursos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
          <label>Sobre o Curso *</label>
          <RichTextEditor
            value={formData.aboutCourse}
            onChange={(value) => setFormData((prev) => ({ ...prev, aboutCourse: value }))}
            placeholder="Texto completo sobre o curso que aparece na seção 'Sobre o curso'"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Informações do Curso *</label>
          <RichTextEditor
            value={formData.courseInformation}
            onChange={(value) => setFormData((prev) => ({ ...prev, courseInformation: value }))}
            placeholder="Informações sobre datas, inscrições, etc. que aparece na seção 'Informações do Curso'"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Documentos Necessários *</label>
          <RichTextEditor
            value={formData.requiredDocuments}
            onChange={(value) => setFormData((prev) => ({ ...prev, requiredDocuments: value }))}
            placeholder="Lista de documentos necessários"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Ícone *</label>
          <input
            type="text"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            required
            placeholder="Ex: police-officer, certificate, pistol, etc."
          />
          <small className={styles.helpText}>
            Ícones disponíveis: thunderbolt, certificate, pistol, house-user, police-officer, security-camera, alert, truck
          </small>
        </div>

        <div className={styles.formGroup}>
          <VideoInput
            value={formData.video}
            onChange={(url) => setFormData((prev) => ({ ...prev, video: url }))}
            label="Vídeo"
            defaultValue="/videos/video-institucional.mp4"
          />
        </div>

        <div className={styles.formGroup}>
          <ImagesCarouselInput
            value={formData.images}
            onChange={(urls) => setFormData((prev) => ({ ...prev, images: urls }))}
            label="Imagens do Carrossel"
            defaultImages={[
              '/images/cursos-1.jpeg',
              '/images/cursos-2.jpeg',
              '/images/cursos-3.jpeg',
              '/images/cursos-4.jpeg',
              '/images/cursos-5.jpeg',
            ]}
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

