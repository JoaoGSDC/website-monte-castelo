'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from '../novo/styles.module.scss';
import { ICourse } from '@/interfaces/course.interface';
import VideoInput from '@/components/admin/VideoInput';
import ImagesCarouselInput from '@/components/admin/ImagesCarouselInput';
import RichTextEditor from '@/components/admin/RichTextEditor';

// Mapeamento de imagens padrão por curso (baseado nas páginas estáticas em _cursos)
const getDefaultImagesForCourse = (slug: string): string[] => {
  const defaultImagesMap: Record<string, string[]> = {
    'armas-nao-letais': [
      '/images/cursos-1.jpeg',
      '/images/cursos-2.jpeg',
      '/images/cursos-3.jpeg',
      '/images/cursos-4.jpeg',
      '/images/cursos-5.jpeg',
    ],
    'formacao-de-vigilantes': [
      '/images/cursos/curso-1.jpg',
      '/images/cursos/curso-3.jpg',
      '/images/cursos/curso-2.jpg',
      '/images/cursos-2.jpeg',
    ],
    'vssp': [
      '/images/cursos/curso-9.jpg',
      '/images/cursos/curso-10.jpg',
      '/images/cursos/curso-12.jpg',
      '/images/cursos/curso-13.jpg',
      '/images/cursos/curso-15.jpg',
      '/images/cursos/curso-16.jpg',
    ],
    'transporte-de-valores': [
      '/images/cursos-1.jpeg',
      '/images/cursos-2.jpeg',
      '/images/cursos-3.jpeg',
      '/images/cursos-4.jpeg',
      '/images/cursos-5.jpeg',
    ],
    'operador-de-cftv': [
      '/images/cursos-1.jpeg',
      '/images/cursos-2.jpeg',
      '/images/cursos-3.jpeg',
      '/images/cursos-4.jpeg',
      '/images/cursos-5.jpeg',
    ],
    'supervisao-chefia-e-seguranca': [
      '/images/cursos-1.jpeg',
      '/images/cursos-2.jpeg',
      '/images/cursos-3.jpeg',
      '/images/cursos-4.jpeg',
      '/images/cursos-5.jpeg',
    ],
    'atualizacao-vssp': [
      '/images/cursos/curso-11.jpg',
      '/images/cursos/curso-14.jpg',
      '/images/cursos/curso-17.jpg',
      '/images/cursos/curso-18.jpg',
      '/images/cursos/curso-19.jpg',
      '/images/cursos/curso-20.jpg',
      '/images/cursos/curso-21.jpg',
    ],
    'atualizacao-transporte-de-valores': [
      '/images/cursos-1.jpeg',
      '/images/cursos-2.jpeg',
      '/images/cursos-3.jpeg',
      '/images/cursos-4.jpeg',
      '/images/cursos-5.jpeg',
    ],
    'atualizacao-de-vigilantes': [
      '/images/cursos/curso-4.jpg',
      '/images/cursos-3.jpeg',
      '/images/cursos/curso-6.jpg',
      '/images/cursos/curso-7.jpg',
      '/images/cursos/curso-8.jpg',
    ],
  };

  return defaultImagesMap[slug] || [
    '/images/cursos-1.jpeg',
    '/images/cursos-2.jpeg',
    '/images/cursos-3.jpeg',
    '/images/cursos-4.jpeg',
    '/images/cursos-5.jpeg',
  ];
};

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
    icon: '',
    video: '',
    images: [] as string[],
    aboutCourse: '',
    courseInformation: '',
    requiredDocuments: '',
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
          icon: course.icon || '',
          video: course.video || '',
          images: course.images || [],
          aboutCourse: course.aboutCourse || '',
          courseInformation: course.courseInformation || '',
          requiredDocuments: course.requiredDocuments || '',
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
      const response = await fetch(`/api/admin/cursos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
            defaultImages={getDefaultImagesForCourse(formData.slug)}
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

