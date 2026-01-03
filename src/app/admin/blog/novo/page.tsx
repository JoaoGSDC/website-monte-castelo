'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './styles.module.scss';
import RichTextEditor from '@/components/admin/RichTextEditor';
import ImageInput from '@/components/admin/ImageInput';

export default function NovoPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    image: '',
    category: '',
    author: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/blog');
      } else {
        const data = await response.json();
        alert(data.error || 'Erro ao criar post');
      }
    } catch (error) {
      console.error('Erro ao criar post:', error);
      alert('Erro ao criar post');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Gerar slug automaticamente a partir do título
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

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  return (
    <div className={styles.container}>
      <h1>Novo Post</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Título *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Título do post"
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
            placeholder="url-do-post"
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <ImageInput
              value={formData.image}
              onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
              label="Imagem"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Categoria</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Categoria"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Resumo *</label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            required
            rows={3}
            placeholder="Resumo do post"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Conteúdo *</label>
          <RichTextEditor
            value={formData.content}
            onChange={handleContentChange}
            placeholder="Conteúdo completo do post"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Autor</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Nome do autor"
          />
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={() => router.back()} className={styles.cancelButton}>
            Cancelar
          </button>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Post'}
          </button>
        </div>
      </form>
    </div>
  );
}

