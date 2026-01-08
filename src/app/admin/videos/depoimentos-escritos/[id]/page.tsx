'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import styles from '../../styles.module.scss';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import ImageInput from '@/components/admin/ImageInput';
import Link from 'next/link';

export default function EditarDepoimentoEscritoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    text: '',
    name: '',
    role: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (id) {
      fetchDepoimento();
    }
  }, [id]);

  const fetchDepoimento = async () => {
    try {
      const response = await fetch('/api/admin/depoimentos-escritos');
      if (response.ok) {
        const depoimentos = await response.json();
        const depoimento = depoimentos.find((dep: any) => dep._id === id);
        if (depoimento) {
          setFormData({
            text: depoimento.text || '',
            name: depoimento.name || '',
            role: depoimento.role || '',
            imageUrl: depoimento.imageUrl || '',
          });
        }
      }
    } catch (error) {
      console.error('Erro ao buscar depoimento:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.text || !formData.name || !formData.role || !formData.imageUrl) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/depoimentos-escritos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Depoimento atualizado com sucesso!');
        router.push('/admin/videos');
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao atualizar depoimento');
      }
    } catch (error) {
      console.error('Erro ao atualizar depoimento:', error);
      alert('Erro ao atualizar depoimento');
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
          <h1>Editar Depoimento Escrito</h1>
          <p>Edite as informações do depoimento</p>
        </div>
        <Link href="/admin/videos" className={styles.backButton}>
          <FiArrowLeft />
          Voltar
        </Link>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="text">Texto do Depoimento *</label>
          <textarea
            id="text"
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            required
            rows={8}
            placeholder="Digite o texto do depoimento..."
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="name">Nome da Pessoa *</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Nome completo"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="role">Função/Cargo *</label>
          <input
            type="text"
            id="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
            placeholder="Ex: Aluno, Ex-aluno, etc."
          />
        </div>

        <div className={styles.formGroup}>
          <ImageInput
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            label="Foto da Pessoa *"
            required
            uploadEndpoint="/api/admin/imagens/upload-image"
          />
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.submitButton} disabled={saving}>
            <FiSave />
            {saving ? 'Salvando...' : 'Salvar Depoimento'}
          </button>
        </div>
      </form>
    </div>
  );
}
