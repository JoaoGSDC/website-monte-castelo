'use client';

import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { FiPlus, FiTrash2, FiDownload, FiFile, FiEdit2, FiCheck, FiX, FiChevronUp, FiChevronDown, FiUpload } from 'react-icons/fi';

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
  const [reordering, setReordering] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [replacingFileId, setReplacingFileId] = useState<string | null>(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [fileNameInput, setFileNameInput] = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/admin/biblioteca');
      if (response.ok) {
        const data = await response.json();
        setFiles(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Erro ao buscar arquivos:', error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, fileId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Apenas arquivos PDF são permitidos');
      e.target.value = '';
      return;
    }

    // Se for substituição, vai direto para upload
    if (fileId) {
      handleFileUpload(file, fileId);
      e.target.value = '';
      return;
    }

    // Se for novo arquivo, abre modal para digitar nome
    setPendingFile(file);
    setShowNameModal(true);
    e.target.value = '';
  };

  const handleFileUpload = async (file: File, fileId?: string, customName?: string) => {
    if (fileId) {
      setReplacingFileId(fileId);
    } else {
      setUploading(true);
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (customName) {
        formData.append('name', customName);
      }

      const url = fileId ? `/api/admin/biblioteca/${fileId}/replace` : '/api/admin/biblioteca';
      const method = fileId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        fetchFiles();
        alert(fileId ? 'Arquivo substituído com sucesso!' : 'Arquivo enviado com sucesso!');
        setReplacingFileId(null);
        setShowNameModal(false);
        setFileNameInput('');
        setPendingFile(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao enviar arquivo');
      }
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
      alert('Erro ao enviar arquivo');
    } finally {
      setUploading(false);
      setReplacingFileId(null);
    }
  };

  const handleConfirmUpload = () => {
    if (!pendingFile) return;

    if (!fileNameInput.trim()) {
      alert('Por favor, digite um nome para o arquivo');
      return;
    }

    handleFileUpload(pendingFile, undefined, fileNameInput.trim());
  };

  const handleCancelUpload = () => {
    setShowNameModal(false);
    setFileNameInput('');
    setPendingFile(null);
  };

  const handleDelete = async (id: string) => {
    if (id === 'default-document') {
      alert('Este é um arquivo padrão e não pode ser excluído');
      return;
    }

    if (!confirm('Tem certeza que deseja excluir este arquivo?')) return;

    try {
      const response = await fetch(`/api/admin/biblioteca/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchFiles();
        alert('Arquivo excluído com sucesso!');
      } else {
        alert('Erro ao excluir arquivo');
      }
    } catch (error) {
      console.error('Erro ao excluir arquivo:', error);
      alert('Erro ao excluir arquivo');
    }
  };

  const handleStartEdit = (file: LibraryFile) => {
    setEditingId(file._id);
    setEditingName(file.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleSaveEdit = async (id: string) => {
    if (!editingName.trim()) {
      alert('O nome não pode estar vazio');
      return;
    }

    try {
      const response = await fetch(`/api/admin/biblioteca/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editingName.trim() }),
      });

      if (response.ok) {
        setFiles((prev) =>
          prev.map((file) => (file._id === id ? { ...file, name: editingName.trim() } : file))
        );
        setEditingId(null);
        setEditingName('');
        alert('Nome atualizado com sucesso!');
      } else {
        alert('Erro ao atualizar nome');
      }
    } catch (error) {
      console.error('Erro ao atualizar nome:', error);
      alert('Erro ao atualizar nome');
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;

    const newFiles = [...files];
    [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];

    setReordering(true);
    try {
      const response = await fetch('/api/admin/biblioteca/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFiles.map((f) => f._id)),
      });

      if (response.ok) {
        setFiles(newFiles);
      } else {
        alert('Erro ao reordenar arquivo');
      }
    } catch (error) {
      console.error('Erro ao reordenar arquivo:', error);
      alert('Erro ao reordenar arquivo');
    } finally {
      setReordering(false);
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === files.length - 1) return;

    const newFiles = [...files];
    [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];

    setReordering(true);
    try {
      const response = await fetch('/api/admin/biblioteca/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFiles.map((f) => f._id)),
      });

      if (response.ok) {
        setFiles(newFiles);
      } else {
        alert('Erro ao reordenar arquivo');
      }
    } catch (error) {
      console.error('Erro ao reordenar arquivo:', error);
      alert('Erro ao reordenar arquivo');
    } finally {
      setReordering(false);
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
        <label className={styles.addButton}>
          <FiPlus />
          {uploading ? 'Enviando...' : 'Adicionar PDF'}
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            disabled={uploading}
          />
        </label>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Ordem</th>
              <th>Nome</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {files.length === 0 ? (
              <tr>
                <td colSpan={4} className={styles.empty}>
                  Nenhum arquivo na biblioteca
                </td>
              </tr>
            ) : (
              files.map((file, index) => (
                <tr key={file._id}>
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
                        disabled={index === files.length - 1 || reordering}
                        className={styles.orderButton}
                        title="Mover para baixo"
                      >
                        <FiChevronDown />
                      </button>
                    </div>
                  </td>
                  <td>
                    {editingId === file._id ? (
                      <div className={styles.editName}>
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className={styles.nameInput}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveEdit(file._id);
                            } else if (e.key === 'Escape') {
                              handleCancelEdit();
                            }
                          }}
                        />
                        <button
                          onClick={() => handleSaveEdit(file._id)}
                          className={styles.saveButton}
                          title="Salvar"
                        >
                          <FiCheck />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className={styles.cancelButton}
                          title="Cancelar"
                        >
                          <FiX />
                        </button>
                      </div>
                    ) : (
                      <div className={styles.fileName}>
                        <FiFile className={styles.fileIcon} />
                        <span>{file.name}</span>
                        {file._id !== 'default-document' && (
                          <button
                            onClick={() => handleStartEdit(file)}
                            className={styles.editButton}
                            title="Editar nome"
                          >
                            <FiEdit2 />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                  <td>{file.createdAt ? new Date(file.createdAt).toLocaleDateString('pt-BR') : '-'}</td>
                  <td>
                    <div className={styles.actions}>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.actionButton}
                        title="Baixar"
                      >
                        <FiDownload />
                      </a>
                      {file._id !== 'default-document' && (
                        <>
                          <label className={styles.actionButton} title="Substituir arquivo PDF">
                            <FiUpload />
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => handleFileSelect(e, file._id)}
                              style={{ display: 'none' }}
                              disabled={replacingFileId === file._id}
                            />
                          </label>
                          <button
                            onClick={() => handleDelete(file._id)}
                            className={`${styles.actionButton} ${styles.deleteButton}`}
                            title="Excluir"
                          >
                            <FiTrash2 />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showNameModal && (
        <div className={styles.modalOverlay} onClick={handleCancelUpload}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Digite o nome do arquivo</h2>
            <p>Este nome será exibido na biblioteca</p>
            <input
              type="text"
              value={fileNameInput}
              onChange={(e) => setFileNameInput(e.target.value)}
              className={styles.modalInput}
              placeholder="Ex: Cartilha de Segurança"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleConfirmUpload();
                } else if (e.key === 'Escape') {
                  handleCancelUpload();
                }
              }}
            />
            <div className={styles.modalActions}>
              <button onClick={handleCancelUpload} className={styles.modalCancelButton}>
                Cancelar
              </button>
              <button onClick={handleConfirmUpload} className={styles.modalConfirmButton}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
