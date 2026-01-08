'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles.module.scss';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import ImageInput from '@/components/admin/ImageInput';
import Link from 'next/link';

export default function NovoDepoimentoEscritoPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    text: '',
    name: '',
    role: '',
    imageUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.text || !formData.name || !formData.role || !formData.imageUrl) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/admin/depoimentos-escritos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Depoimento criado com sucesso!');
        router.push('/admin/videos');
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao criar depoimento');
      }
    } catch (error) {
      console.error('Erro ao criar depoimento:', error);
      alert('Erro ao criar depoimento');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Criar Depoimento Escrito</h1>
          <p>Adicione um novo depoimento escrito</p>
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
