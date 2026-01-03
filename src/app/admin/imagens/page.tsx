'use client';

import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { FiSave } from 'react-icons/fi';

interface ImageConfig {
  logo: string;
  logoBlack: string;
  blogCover: string;
  blogPostsCover: string;
  quemSomosHeader: string;
  cursosHeader: string;
  contactHeader: string;
}

export default function ImagensPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ImageConfig>({
    logo: '',
    logoBlack: '',
    blogCover: '',
    blogPostsCover: '',
    quemSomosHeader: '',
    cursosHeader: '',
    contactHeader: '',
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/admin/imagens');
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      }
    } catch (error) {
      console.error('Erro ao buscar imagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/imagens', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Imagens salvas com sucesso!');
      } else {
        alert('Erro ao salvar imagens');
      }
    } catch (error) {
      console.error('Erro ao salvar imagens:', error);
      alert('Erro ao salvar imagens');
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

  const imageFields = [
    { key: 'logo', label: 'Logo (Branco)' },
    { key: 'logoBlack', label: 'Logo (Preto)' },
    { key: 'blogCover', label: 'Capa do Blog' },
    { key: 'blogPostsCover', label: 'Capa dos Posts do Blog' },
    { key: 'quemSomosHeader', label: 'Header - Quem Somos' },
    { key: 'cursosHeader', label: 'Header - Cursos' },
    { key: 'contactHeader', label: 'Header - Contato' },
  ] as const;

  return (
    <div className={styles.container}>
      <h1>Gerenciar Imagens</h1>
      <p className={styles.subtitle}>Altere as imagens do website</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        {imageFields.map((field) => (
          <div key={field.key} className={styles.formGroup}>
            <label>{field.label}</label>
            <input
              type="url"
              name={field.key}
              value={formData[field.key]}
              onChange={handleChange}
              placeholder="https://exemplo.com/imagem.jpg"
            />
            {formData[field.key] && (
              <div className={styles.preview}>
                <img src={formData[field.key]} alt={field.label} />
              </div>
            )}
          </div>
        ))}

        <div className={styles.actions}>
          <button type="submit" className={styles.submitButton} disabled={saving}>
            <FiSave />
            {saving ? 'Salvando...' : 'Salvar Imagens'}
          </button>
        </div>
      </form>
    </div>
  );
}

