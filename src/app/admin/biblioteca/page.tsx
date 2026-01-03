'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './styles.module.scss';
import { FiPlus, FiTrash2, FiDownload } from 'react-icons/fi';

interface LibraryFile {
  _id: string;
  name: string;
  url: string;
  createdAt: string;
}

export default function BibliotecaPage() {
  const [files, setFiles] = useState<LibraryFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/admin/biblioteca');
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error('Erro ao buscar arquivos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Apenas arquivos PDF são permitidos');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/biblioteca', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        fetchFiles();
        alert('Arquivo enviado com sucesso!');
      } else {
        alert('Erro ao enviar arquivo');
      }
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
      alert('Erro ao enviar arquivo');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este arquivo?')) return;

    try {
      const response = await fetch(`/api/admin/biblioteca/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchFiles();
      } else {
        alert('Erro ao excluir arquivo');
      }
    } catch (error) {
      console.error('Erro ao excluir arquivo:', error);
      alert('Erro ao excluir arquivo');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Gerenciar Biblioteca</h1>
          <p>Gerencie os arquivos PDF da biblioteca</p>
        </div>
        <label className={styles.uploadButton}>
          <FiPlus />
          {uploading ? 'Enviando...' : 'Adicionar PDF'}
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            disabled={uploading}
          />
        </label>
      </div>

      <div className={styles.filesList}>
        {files.length === 0 ? (
          <div className={styles.empty}>Nenhum arquivo na biblioteca</div>
        ) : (
          files.map((file) => (
            <div key={file._id} className={styles.fileCard}>
              <div className={styles.fileInfo}>
                <h3>{file.name}</h3>
                <p>Adicionado em {new Date(file.createdAt).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className={styles.actions}>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.downloadButton}
                >
                  <FiDownload />
                  Baixar
                </a>
                <button
                  onClick={() => handleDelete(file._id)}
                  className={styles.deleteButton}
                >
                  <FiTrash2 />
                  Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

