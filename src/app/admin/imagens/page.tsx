'use client';

import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { FiSave } from 'react-icons/fi';
import ImageInput from '@/components/admin/ImageInput';
import VideoInput from '@/components/admin/VideoInput';
import ImagesCarouselInput from '@/components/admin/ImagesCarouselInput';

interface ImageConfig {
  // Tab: Início
  home: {
    whoWeAreImage: string; // Seção "Quem Somos"
    depoimentsMainImage: string; // Seção "Conheça a Academia Monte Castelo" - imagem principal
    depoimentsTitleImage: string; // Seção "Conheça a Academia Monte Castelo" - imagem de depoimentos
    ourCoursesImage: string; // Seção "Nossos Cursos" - junto com "Seja um profissional destacado"
  };
  // Tab: Quem Somos
  quemSomos: {
    cover: string; // Capa no topo
    video: string; // Vídeo
    carousel: string[]; // Carrossel de fotos
  };
  // Tab: Cursos
  cursos: {
    sidebarImage: string; // Imagem na sidebar (aside)
  };
  // Tab: Blog
  blog: {
    cover: string; // Imagem de capa
  };
  // Tab: Logos
  logos: {
    logo: string; // Logo padrão (logo.png)
    logoBlack: string; // Logo preta (logo-black.png)
  };
}

export default function ImagensPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'inicio' | 'quem-somos' | 'cursos' | 'blog' | 'logos'>('inicio');
  
  // Valores padrão do sistema
  const defaultValues: ImageConfig = {
    home: {
      whoWeAreImage: '/images/cursos-5.jpeg',
      depoimentsMainImage: '/images/aula.jpg',
      depoimentsTitleImage: '/images/background-5.jpg',
      ourCoursesImage: '/images/background-6.jpg',
    },
    quemSomos: {
      cover: '/images/places/frente.jpg',
      video: '/videos/video-1.mp4',
      carousel: [],
    },
    cursos: {
      sidebarImage: '/images/blog-cover.png',
    },
    blog: {
      cover: '/images/blog-cover.jpg',
    },
    logos: {
      logo: '/logo.png',
      logoBlack: '/logo-black.png',
    },
  };

  const [formData, setFormData] = useState<ImageConfig>({
    home: {
      whoWeAreImage: '',
      depoimentsMainImage: '',
      depoimentsTitleImage: '',
      ourCoursesImage: '',
    },
    quemSomos: {
      cover: '',
      video: '',
      carousel: [],
    },
    cursos: {
      sidebarImage: '',
    },
    blog: {
      cover: '',
    },
    logos: {
      logo: '',
      logoBlack: '',
    },
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/admin/imagens');
      if (response.ok) {
        const data = await response.json();
        setFormData({
          home: {
            whoWeAreImage: data.home?.whoWeAreImage || '',
            depoimentsMainImage: data.home?.depoimentsMainImage || '',
            depoimentsTitleImage: data.home?.depoimentsTitleImage || '',
            ourCoursesImage: data.home?.ourCoursesImage || '',
          },
          quemSomos: {
            cover: data.quemSomos?.cover || '',
            video: data.quemSomos?.video || '',
            carousel: data.quemSomos?.carousel || [],
          },
          cursos: {
            sidebarImage: data.cursos?.sidebarImage || '',
          },
          blog: {
            cover: data.blog?.cover || '',
          },
          logos: {
            logo: data.logos?.logo || defaultValues.logos.logo,
            logoBlack: data.logos?.logoBlack || defaultValues.logos.logoBlack,
          },
        });
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

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Gerenciar Imagens</h1>
      <p className={styles.subtitle}>Altere as imagens do website</p>

      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'inicio' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('inicio')}
        >
          Início
        </button>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'quem-somos' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('quem-somos')}
        >
          Quem Somos
        </button>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'cursos' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('cursos')}
        >
          Cursos
        </button>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'blog' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('blog')}
        >
          Blog
        </button>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'logos' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('logos')}
        >
          Logos
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {activeTab === 'inicio' && (
          <div className={styles.tabContent}>
            <div className={styles.section}>
              <h2>Seção: Quem Somos</h2>
              <div className={styles.formGroup}>
                <ImageInput
                  value={formData.home.whoWeAreImage}
                  onChange={(url) => setFormData((prev) => ({ ...prev, home: { ...prev.home, whoWeAreImage: url } }))}
                  label="Imagem da seção Quem Somos"
                  uploadEndpoint="/api/admin/imagens/upload-image"
                  defaultValue={defaultValues.home.whoWeAreImage}
                />
              </div>
            </div>

            <div className={styles.section}>
              <h2>Seção: Conheça a Academia Monte Castelo</h2>
              <div className={styles.formGroup}>
                <ImageInput
                  value={formData.home.depoimentsMainImage}
                  onChange={(url) => setFormData((prev) => ({ ...prev, home: { ...prev.home, depoimentsMainImage: url } }))}
                  label="Imagem principal"
                  uploadEndpoint="/api/admin/imagens/upload-image"
                  defaultValue={defaultValues.home.depoimentsMainImage}
                />
              </div>
              <div className={styles.formGroup}>
                <ImageInput
                  value={formData.home.depoimentsTitleImage}
                  onChange={(url) => setFormData((prev) => ({ ...prev, home: { ...prev.home, depoimentsTitleImage: url } }))}
                  label="Imagem da parte de depoimentos"
                  uploadEndpoint="/api/admin/imagens/upload-image"
                  defaultValue={defaultValues.home.depoimentsTitleImage}
                />
              </div>
            </div>

            <div className={styles.section}>
              <h2>Seção: Nossos Cursos</h2>
              <div className={styles.formGroup}>
                <ImageInput
                  value={formData.home.ourCoursesImage}
                  onChange={(url) => setFormData((prev) => ({ ...prev, home: { ...prev.home, ourCoursesImage: url } }))}
                  label="Imagem junto com 'Seja um profissional destacado'"
                  uploadEndpoint="/api/admin/imagens/upload-image"
                  defaultValue={defaultValues.home.ourCoursesImage}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quem-somos' && (
          <div className={styles.tabContent}>
            <div className={styles.formGroup}>
              <ImageInput
                value={formData.quemSomos.cover}
                onChange={(url) => setFormData((prev) => ({ ...prev, quemSomos: { ...prev.quemSomos, cover: url } }))}
                label="Capa no topo da tela"
                uploadEndpoint="/api/admin/imagens/upload-image"
                defaultValue={defaultValues.quemSomos.cover}
              />
            </div>

            <div className={styles.formGroup}>
              <VideoInput
                value={formData.quemSomos.video}
                onChange={(url) => setFormData((prev) => ({ ...prev, quemSomos: { ...prev.quemSomos, video: url } }))}
                label="Vídeo"
                uploadEndpoint="/api/admin/cursos/upload-video"
                defaultValue={defaultValues.quemSomos.video}
              />
            </div>

            <div className={styles.formGroup}>
              <ImagesCarouselInput
                value={formData.quemSomos.carousel}
                onChange={(urls) => setFormData((prev) => ({ ...prev, quemSomos: { ...prev.quemSomos, carousel: urls } }))}
                label="Carrossel de fotos"
                uploadEndpoint="/api/admin/imagens/upload-image"
                defaultImages={[
                  '/images/places/frente.jpg',
                  '/images/places/entrada-1.jpg',
                  '/images/places/entrada-2.jpg',
                  '/images/places/entrada-3.jpg',
                  '/images/places/stand-de-tiro-7.jpg',
                  '/images/places/stand-de-tiro-8.jpg',
                  '/images/places/stand-de-tiro-1.jpg',
                  '/images/places/stand-de-tiro-2.jpg',
                  '/images/places/stand-de-tiro-3.jpg',
                  '/images/places/stand-de-tiro-4.jpg',
                  '/images/places/stand-de-tiro-5.jpg',
                  '/images/places/stand-de-tiro-6.jpg',
                  '/images/places/recepcao-1.jpg',
                  '/images/places/recepcao-2.jpg',
                  '/images/places/sala-de-aula-1.jpg',
                  '/images/places/sala-de-aula-2.jpg',
                  '/images/places/sala-de-aula-3.jpg',
                  '/images/places/tiro-virtual-1.jpg',
                  '/images/places/tiro-virtual-2.jpg',
                  '/images/places/tiro-virtual-3.jpg',
                  '/images/places/academia-1.jpg',
                  '/images/places/academia-2.jpg',
                  '/images/places/academia-3.jpg',
                  '/images/places/academia-4.jpg',
                  '/images/places/academia-5.jpg',
                  '/images/places/academia-6.jpg',
                  '/images/places/refeitorio-1.jpg',
                  '/images/places/refeitorio-2.jpg',
                ]}
              />
            </div>
          </div>
        )}

        {activeTab === 'cursos' && (
          <div className={styles.tabContent}>
            <div className={styles.formGroup}>
              <ImageInput
                value={formData.cursos.sidebarImage}
                onChange={(url) => setFormData((prev) => ({ ...prev, cursos: { ...prev.cursos, sidebarImage: url } }))}
                label="Imagem na sidebar (aside)"
                uploadEndpoint="/api/admin/imagens/upload-image"
                defaultValue={defaultValues.cursos.sidebarImage}
              />
            </div>
          </div>
        )}

        {activeTab === 'blog' && (
          <div className={styles.tabContent}>
            <div className={styles.formGroup}>
              <ImageInput
                value={formData.blog.cover}
                onChange={(url) => setFormData((prev) => ({ ...prev, blog: { ...prev.blog, cover: url } }))}
                label="Imagem de capa"
                uploadEndpoint="/api/admin/imagens/upload-image"
                defaultValue={defaultValues.blog.cover}
              />
            </div>
          </div>
        )}

        {activeTab === 'logos' && (
          <div className={styles.tabContent}>
            <div className={styles.formGroup}>
              <ImageInput
                value={formData.logos?.logo || defaultValues.logos.logo}
                onChange={(url) => setFormData((prev) => ({ ...prev, logos: { ...(prev.logos || defaultValues.logos), logo: url } }))}
                label="Logo padrão (logo.png)"
                uploadEndpoint="/api/admin/imagens/upload-image"
                defaultValue={defaultValues.logos.logo}
              />
            </div>
            <div className={styles.formGroup}>
              <ImageInput
                value={formData.logos?.logoBlack || defaultValues.logos.logoBlack}
                onChange={(url) => setFormData((prev) => ({ ...prev, logos: { ...(prev.logos || defaultValues.logos), logoBlack: url } }))}
                label="Logo preta (logo-black.png)"
                uploadEndpoint="/api/admin/imagens/upload-image"
                defaultValue={defaultValues.logos.logoBlack}
              />
            </div>
          </div>
        )}

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
