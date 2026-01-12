'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import styles from './styles.module.scss';
import { FiX, FiPlus, FiChevronUp, FiChevronDown } from 'react-icons/fi';

interface ImagesCarouselInputProps {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  required?: boolean;
  uploadEndpoint?: string; // Endpoint customizado para upload (padrão: '/api/admin/cursos/upload-image')
  defaultImages?: string[]; // Imagens padrão para restaurar
}

export default function ImagesCarouselInput({ 
  value, 
  onChange, 
  label = 'Imagens do Carrossel', 
  required = false,
  uploadEndpoint = '/api/admin/cursos/upload-image',
  defaultImages = []
}: ImagesCarouselInputProps) {
  const [uploadMode, setUploadMode] = useState<'url' | 'upload'>('url');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
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

    // Validar tamanho (10MB)
    const maxSize = 10 * 1024 * 1024;
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
      onChange([...value, data.url]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer upload da imagem';
      setError(errorMessage);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      onChange([...value, urlInput.trim()]);
      setUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...value];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    onChange(newImages);
  };

  const handleMoveDown = (index: number) => {
    if (index === value.length - 1) return;
    const newImages = [...value];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    onChange(newImages);
  };

  const handleAddDefaultImages = () => {
    if (defaultImages && defaultImages.length > 0) {
      // Adiciona apenas as imagens padrão que ainda não estão na lista
      const newImages = [...value];
      defaultImages.forEach((img) => {
        if (!newImages.includes(img)) {
          newImages.push(img);
        }
      });
      onChange(newImages);
    }
  };

  return (
    <div className={styles.imagesInput}>
      <label>
        {label} {required && '*'}
        <span className={styles.hint}>(Imagens do carrossel do curso)</span>
      </label>
      
      {/* Input hidden para validação do formulário */}
      {required && <input type="hidden" value={value.length > 0 ? '1' : ''} required />}
      
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
            value={urlInput || ''}
            onChange={(e) => setUrlInput(e.target.value || '')}
            placeholder="https://exemplo.com/imagem.jpg"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddUrl();
              }
            }}
          />
          <div className={styles.urlActions}>
            <button
              type="button"
              onClick={handleAddUrl}
              className={styles.addButton}
              disabled={!urlInput.trim()}
            >
              <FiPlus />
              Adicionar
            </button>
            {defaultImages && defaultImages.length > 0 && (
              <button
                type="button"
                onClick={handleAddDefaultImages}
                className={styles.defaultButton}
                title="Adicionar imagens padrão"
              >
                Mídia Padrão
              </button>
            )}
          </div>
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
            {defaultImages && defaultImages.length > 0 && (
              <button
                type="button"
                onClick={handleAddDefaultImages}
                className={styles.defaultButton}
                title="Adicionar imagens padrão"
              >
                Mídia Padrão
              </button>
            )}
          </div>
          {error && <span className={styles.error}>{error}</span>}
        </div>
      )}

      {value.length > 0 && (
        <div className={styles.imagesList}>
          {value.map((url, index) => (
            <div key={index} className={styles.imageItem}>
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image
                  src={url}
                  alt={`Carrossel ${index + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              </div>
              <div className={styles.imageControls}>
                <div className={styles.orderControls}>
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className={styles.orderButton}
                    title="Mover para cima"
                  >
                    <FiChevronUp />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === value.length - 1}
                    className={styles.orderButton}
                    title="Mover para baixo"
                  >
                    <FiChevronDown />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className={styles.removeButton}
                  title="Remover imagem"
                >
                  <FiX />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
