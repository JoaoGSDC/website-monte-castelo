'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from '../styles.module.scss';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import ImageInput from '@/components/admin/ImageInput';
import Link from 'next/link';

interface CarouselItem {
  image: string;
  hollowText: string;
  title: string;
  titleMarked: string;
  buttonPrimary: string;
  buttonPrimaryLink: string;
  buttonSecondary: string;
  buttonSecondaryLink: string;
}

export default function EditCarouselItemPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const index = parseInt(id);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<CarouselItem>({
    image: '',
    hollowText: '',
    title: '',
    titleMarked: '',
    buttonPrimary: '',
    buttonPrimaryLink: '',
    buttonSecondary: '',
    buttonSecondaryLink: '',
  });

  useEffect(() => {
    fetchCarousel();
  }, []);

  const fetchCarousel = async () => {
    try {
      const response = await fetch('/api/admin/carrossel');
      if (response.ok) {
        const items = await response.json();
        if (Array.isArray(items) && items[index]) {
          setFormData({
            image: items[index].image || '',
            hollowText: items[index].hollowText || '',
            title: items[index].title || '',
            titleMarked: items[index].titleMarked || '',
            buttonPrimary: items[index].buttonPrimary || '',
            buttonPrimaryLink: items[index].buttonPrimaryLink || '',
            buttonSecondary: items[index].buttonSecondary || '',
            buttonSecondaryLink: items[index].buttonSecondaryLink || '',
          });
        }
      }
    } catch (error) {
      console.error('Erro ao buscar item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação condicional: se algum campo de texto/botão for preenchido, valida regras específicas
    const hasAnyText = formData.hollowText || formData.title || formData.titleMarked;
    const hasPrimaryButton = formData.buttonPrimary || formData.buttonPrimaryLink;
    const hasSecondaryButton = formData.buttonSecondary || formData.buttonSecondaryLink;
    const hasAnyTextOrButton = hasAnyText || hasPrimaryButton || hasSecondaryButton;

    if (hasAnyTextOrButton) {
      // Se preencher botão primário, deve ter texto E link
      if (hasPrimaryButton) {
        if (!formData.buttonPrimary) {
          alert('Se você preencher o link do Botão Primário, deve preencher também o texto');
          return;
        }
        if (!formData.buttonPrimaryLink) {
          alert('Se você preencher o texto do Botão Primário, deve preencher também o link');
          return;
        }
      }

      // Se preencher botão secundário, deve ter texto E link
      if (hasSecondaryButton) {
        if (!formData.buttonSecondary) {
          alert('Se você preencher o link do Botão Secundário, deve preencher também o texto');
          return;
        }
        if (!formData.buttonSecondaryLink) {
          alert('Se você preencher o texto do Botão Secundário, deve preencher também o link');
          return;
        }
      }

      // Se tem botões mas não tem texto, alerta (mas permite, pois pode ser apenas imagem com botões)
      if ((hasPrimaryButton || hasSecondaryButton) && !hasAnyText) {
        // Permitir apenas botões sem textos, não precisa validar
      }
    }

    if (!formData.image) {
      alert('A imagem é obrigatória');
      return;
    }

    setSaving(true);

    try {
      // Buscar todos os itens
      const response = await fetch('/api/admin/carrossel');
      const allItems = await response.json();
      const items = Array.isArray(allItems) ? allItems : [];

      // Atualizar o item específico
      items[index] = formData;

      // Salvar todos os itens
      const saveResponse = await fetch('/api/admin/carrossel', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(items),
      });

      if (saveResponse.ok) {
        alert('Item salvo com sucesso!');
        router.push('/admin/carrossel');
      } else {
        alert('Erro ao salvar item');
      }
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      alert('Erro ao salvar item');
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
          <Link href="/admin/carrossel" className={styles.backButton}>
            <FiArrowLeft />
            Voltar
          </Link>
          <h1>Editar Item do Carrossel</h1>
          <p>Edite o item {index + 1} do carrossel</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <ImageInput
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
              label="Imagem"
              required
              uploadEndpoint="/api/admin/imagens/upload-image"
              defaultValue="/images/background-1.png"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Texto Oco</label>
            <input
              type="text"
              value={formData.hollowText}
              onChange={(e) => setFormData({ ...formData, hollowText: e.target.value })}
              placeholder="Invista no"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Título</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="seu futuro"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Título Marcado</label>
            <input
              type="text"
              value={formData.titleMarked}
              onChange={(e) => setFormData({ ...formData, titleMarked: e.target.value })}
              placeholder="profissional"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Texto do Botão Primário</label>
            <input
              type="text"
              value={formData.buttonPrimary}
              onChange={(e) => setFormData({ ...formData, buttonPrimary: e.target.value })}
              placeholder="Nossos cursos"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Link do Botão Primário</label>
            <input
              type="text"
              value={formData.buttonPrimaryLink}
              onChange={(e) => setFormData({ ...formData, buttonPrimaryLink: e.target.value })}
              placeholder="/cursos ou https://exemplo.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Texto do Botão Secundário</label>
            <input
              type="text"
              value={formData.buttonSecondary}
              onChange={(e) => setFormData({ ...formData, buttonSecondary: e.target.value })}
              placeholder="Entrar em contato"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Link do Botão Secundário</label>
            <input
              type="text"
              value={formData.buttonSecondaryLink}
              onChange={(e) => setFormData({ ...formData, buttonSecondaryLink: e.target.value })}
              placeholder="https://forms.gle/c3JLdbkw3S5rPWZ39"
            />
          </div>
        </div>

        <div className={styles.actionsSection}>
          <button type="submit" className={styles.submitButton} disabled={saving}>
            <FiSave />
            {saving ? 'Salvando...' : 'Salvar Item'}
          </button>
        </div>
      </form>
    </div>
  );
}
