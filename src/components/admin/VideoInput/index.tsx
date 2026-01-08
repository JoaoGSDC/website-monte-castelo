'use client';

import { useState, useRef } from 'react';
import styles from './styles.module.scss';

interface VideoInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
  uploadEndpoint?: string; // Endpoint customizado para upload (padrão: '/api/admin/cursos/upload-video')
  defaultValue?: string; // Valor padrão para restaurar
}

export default function VideoInput({ 
  value, 
  onChange, 
  label = 'Vídeo', 
  required = false,
  uploadEndpoint = '/api/admin/cursos/upload-video',
  defaultValue
}: VideoInputProps) {
  const [uploadMode, setUploadMode] = useState<'url' | 'upload'>('url');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validar tipo
    if (!file.type.startsWith('video/')) {
      setError('Apenas arquivos de vídeo são permitidos');
      return;
    }

    // Validar tamanho (100MB)
    const maxSize = 100 * 1024 * 1024;
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
        throw new Error(data.error || 'Erro ao fazer upload do vídeo');
      }

      const data = await response.json();
      onChange(data.url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer upload do vídeo';
      setError(errorMessage);
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
    <div className={styles.videoInput}>
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
            placeholder="https://exemplo.com/video.mp4"
          />
          {defaultValue && (
            <button
              type="button"
              onClick={() => onChange(defaultValue)}
              className={styles.defaultButton}
              title="Restaurar vídeo padrão"
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
            accept="video/*"
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
              {uploading ? 'Enviando...' : 'Selecionar Vídeo'}
            </button>
            {defaultValue && (
              <button
                type="button"
                onClick={() => onChange(defaultValue)}
                className={styles.defaultButton}
                title="Restaurar vídeo padrão"
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
          <video src={value} controls onError={() => setError('Erro ao carregar vídeo')}>
            Seu navegador não suporta a tag de vídeo.
          </video>
        </div>
      )}
    </div>
  );
}
