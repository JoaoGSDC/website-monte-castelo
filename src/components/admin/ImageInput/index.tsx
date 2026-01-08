'use client';

import { useState, useRef } from 'react';
import styles from './styles.module.scss';

interface ImageInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
  uploadEndpoint?: string; // Endpoint customizado para upload (padrão: '/api/admin/blog/upload-image')
  defaultValue?: string; // Valor padrão para restaurar
}

export default function ImageInput({ 
  value, 
  onChange, 
  label = 'Imagem', 
  required = false,
  uploadEndpoint = '/api/admin/blog/upload-image',
  defaultValue
}: ImageInputProps) {
  const [uploadMode, setUploadMode] = useState<'url' | 'upload'>('url');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setError('Apenas arquivos de imagem são permitidos');
      return;
    }

    // Validar tamanho (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`Arquivo muito grande. Tamanho máximo: ${maxSize / 1024 / 1024}MB`);
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao fazer upload da imagem');
      }

      const data = await response.json();
      onChange(data.url);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer upload da imagem');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={styles.imageInput}>
      <label>{label} {required && '*'}</label>
      
      {/* Input hidden para validação do formulário */}
      {required && <input type="hidden" value={value} required />}
      
      <div className={styles.modeSelector}>
        <button
          type="button"
          onClick={() => setUploadMode('url')}
          className={uploadMode === 'url' ? styles.active : ''}
        >
          Usar URL
        </button>
        <button
          type="button"
          onClick={() => setUploadMode('upload')}
          className={uploadMode === 'upload' ? styles.active : ''}
        >
          Fazer Upload
        </button>
      </div>

      {uploadMode === 'url' ? (
        <div className={styles.urlInputContainer}>
          <input
            type="text"
            value={value}
            onChange={handleUrlChange}
            required={required}
            placeholder="https://exemplo.com/imagem.jpg"
          />
          {defaultValue && (
            <button
              type="button"
              onClick={() => onChange(defaultValue)}
              className={styles.defaultButton}
              title="Restaurar imagem padrão"
            >
              Mídia Padrão
            </button>
          )}
        </div>
      ) : (
        <div className={styles.uploadContainer}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className={styles.fileInput}
          />
          <div className={styles.uploadActions}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className={styles.uploadButton}
            >
              {uploading ? 'Enviando...' : 'Selecionar Imagem'}
            </button>
            {defaultValue && (
              <button
                type="button"
                onClick={() => onChange(defaultValue)}
                className={styles.defaultButton}
                title="Restaurar imagem padrão"
              >
                Mídia Padrão
              </button>
            )}
          </div>
          {error && <span className={styles.error}>{error}</span>}
        </div>
      )}

      {value && (
        <div className={styles.preview}>
          <img src={value} alt="Preview" onError={() => setError('Erro ao carregar imagem')} />
        </div>
      )}
    </div>
  );
}
