'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './styles.module.scss';
import { FiPlus, FiEdit, FiTrash2, FiChevronUp, FiChevronDown, FiSave } from 'react-icons/fi';
import VideoInput from '@/components/admin/VideoInput';
import DepoimentosEscritosSection from './depoimentos-escritos-section';

interface Depoimento {
  video: string;
  capa: string;
}

interface VideosConfig {
  videoInstitucional: string;
  depoimentos: Depoimento[];
}

export default function DepoimentosPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [config, setConfig] = useState<VideosConfig>({
    videoInstitucional: '',
    depoimentos: [],
  });

  useEffect(() => {
    fetchDepoimentos();
  }, []);

  const fetchDepoimentos = async () => {
    try {
      const response = await fetch('/api/admin/videos');
      if (response.ok) {
        const data = await response.json();
        setConfig({
          videoInstitucional: data.videoInstitucional || '',
          depoimentos: Array.isArray(data.depoimentos) ? data.depoimentos : [],
        });
      }
    } catch (error) {
      console.error('Erro ao buscar depoimentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInstitucional = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/videos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        alert('Vídeo institucional salvo com sucesso!');
      } else {
        alert('Erro ao salvar vídeo institucional');
      }
    } catch (error) {
      console.error('Erro ao salvar vídeo institucional:', error);
      alert('Erro ao salvar vídeo institucional');
    } finally {
      setSaving(false);
    }
  };


  const handleDelete = async (index: number) => {
    if (!confirm('Tem certeza que deseja remover este depoimento?')) return;

    const newDepoimentos = config.depoimentos.filter((_, i) => i !== index);
    const newConfig = { ...config, depoimentos: newDepoimentos };

    setSaving(true);
    try {
      const response = await fetch('/api/admin/videos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConfig),
      });

      if (response.ok) {
        setConfig(newConfig);
        alert('Depoimento removido com sucesso!');
      } else {
        alert('Erro ao remover depoimento');
      }
    } catch (error) {
      console.error('Erro ao remover depoimento:', error);
      alert('Erro ao remover depoimento');
    } finally {
      setSaving(false);
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;

    const newDepoimentos = [...config.depoimentos];
    [newDepoimentos[index - 1], newDepoimentos[index]] = [newDepoimentos[index], newDepoimentos[index - 1]];

    setReordering(true);
    try {
      const newConfig = { ...config, depoimentos: newDepoimentos };
      const response = await fetch('/api/admin/videos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConfig),
      });

      if (response.ok) {
        setConfig(newConfig);
      } else {
        alert('Erro ao reordenar depoimento');
      }
    } catch (error) {
      console.error('Erro ao reordenar depoimento:', error);
      alert('Erro ao reordenar depoimento');
    } finally {
      setReordering(false);
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === config.depoimentos.length - 1) return;

    const newDepoimentos = [...config.depoimentos];
    [newDepoimentos[index], newDepoimentos[index + 1]] = [newDepoimentos[index + 1], newDepoimentos[index]];

    setReordering(true);
    try {
      const newConfig = { ...config, depoimentos: newDepoimentos };
      const response = await fetch('/api/admin/videos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConfig),
      });

      if (response.ok) {
        setConfig(newConfig);
      } else {
        alert('Erro ao reordenar depoimento');
      }
    } catch (error) {
      console.error('Erro ao reordenar depoimento:', error);
      alert('Erro ao reordenar depoimento');
    } finally {
      setReordering(false);
    }
  };

  const handleAdd = async () => {
    const newDepoimento: Depoimento = {
      video: '',
      capa: '',
    };

    const newDepoimentos = [...config.depoimentos, newDepoimento];
    const newConfig = { ...config, depoimentos: newDepoimentos };

    setSaving(true);
    try {
      const response = await fetch('/api/admin/videos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConfig),
      });

      if (response.ok) {
        setConfig(newConfig);
        // Redirecionar para a página de edição do novo depoimento
        window.location.href = `/admin/videos/${newDepoimentos.length - 1}`;
      } else {
        alert('Erro ao adicionar depoimento');
      }
    } catch (error) {
      console.error('Erro ao adicionar depoimento:', error);
      alert('Erro ao adicionar depoimento');
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
          <h1>Gerenciar Depoimentos</h1>
          <p>Gerencie os vídeos de depoimentos e o vídeo institucional</p>
        </div>
        <button onClick={handleAdd} className={styles.addButton}>
          <FiPlus />
          Adicionar Depoimento
        </button>
      </div>

      {/* Seção Vídeo Institucional */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Vídeo Institucional</h2>
        </div>
        <div className={styles.formCard}>
          <div className={styles.formGroup}>
            <VideoInput
              value={config.videoInstitucional}
              onChange={(url) => setConfig({ ...config, videoInstitucional: url })}
              label="Vídeo Institucional"
              uploadEndpoint="/api/admin/cursos/upload-video"
              defaultValue="/videos/video-institucional.mp4"
            />
          </div>
          <div className={styles.actionsSection}>
            <button onClick={handleSaveInstitucional} className={styles.submitButton} disabled={saving}>
              <FiSave />
              {saving ? 'Salvando...' : 'Salvar Vídeo Institucional'}
            </button>
          </div>
        </div>
      </div>

      {/* Listagem de Depoimentos em Vídeo */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Depoimentos em Vídeo</h2>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Ordem</th>
                <th>Capa</th>
                <th>Vídeo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {config.depoimentos.length === 0 ? (
                <tr>
                  <td colSpan={4} className={styles.empty}>
                    Nenhum depoimento cadastrado
                  </td>
                </tr>
              ) : (
                config.depoimentos.map((depoimento, index) => (
                  <tr key={index}>
                    <td>
                      <div className={styles.orderControls}>
                        <button
                          type="button"
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0 || reordering}
                          className={styles.orderButton}
                          title="Mover para cima"
                        >
                          <FiChevronUp />
                        </button>
                        <span className={styles.orderNumber}>{index + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleMoveDown(index)}
                          disabled={index === config.depoimentos.length - 1 || reordering}
                          className={styles.orderButton}
                          title="Mover para baixo"
                        >
                          <FiChevronDown />
                        </button>
                      </div>
                    </td>
                    <td>
                      {depoimento.capa ? (
                        <img src={depoimento.capa} alt={`Depoimento ${index + 1}`} className={styles.image} />
                      ) : (
                        <span className={styles.noImage}>Sem capa</span>
                      )}
                    </td>
                    <td>
                      {depoimento.video ? (
                        <span className={styles.videoUrl}>{depoimento.video.substring(0, 50)}...</span>
                      ) : (
                        <span className={styles.noVideo}>Sem vídeo</span>
                      )}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Link href={`/admin/videos/${index}`} className={styles.actionButton}>
                          <FiEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(index)}
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seção Depoimentos Escritos */}
      <DepoimentosEscritosSection />
    </div>
  );
}
