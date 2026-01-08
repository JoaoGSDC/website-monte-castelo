'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './styles.module.scss';
import { FiPlus, FiEdit, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi';

interface DepoimentoEscrito {
  _id: string;
  text: string;
  name: string;
  role: string;
  imageUrl: string;
  order: number;
}

export default function DepoimentosEscritosSection() {
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);
  const [depoimentos, setDepoimentos] = useState<DepoimentoEscrito[]>([]);

  useEffect(() => {
    fetchDepoimentos();
  }, []);

  const fetchDepoimentos = async () => {
    try {
      const response = await fetch('/api/admin/depoimentos-escritos');
      if (response.ok) {
        const data = await response.json();
        setDepoimentos(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Erro ao buscar depoimentos escritos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este depoimento escrito?')) return;

    try {
      const response = await fetch(`/api/admin/depoimentos-escritos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDepoimentos(depoimentos.filter((dep) => dep._id !== id));
        alert('Depoimento removido com sucesso!');
      } else {
        alert('Erro ao remover depoimento');
      }
    } catch (error) {
      console.error('Erro ao remover depoimento:', error);
      alert('Erro ao remover depoimento');
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;

    const newDepoimentos = [...depoimentos];
    [newDepoimentos[index - 1], newDepoimentos[index]] = [newDepoimentos[index], newDepoimentos[index - 1]];

    setReordering(true);
    try {
      const orderedIds = newDepoimentos.map((dep) => dep._id);
      const response = await fetch('/api/admin/depoimentos-escritos/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderedIds),
      });

      if (response.ok) {
        setDepoimentos(newDepoimentos);
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
    if (index === depoimentos.length - 1) return;

    const newDepoimentos = [...depoimentos];
    [newDepoimentos[index], newDepoimentos[index + 1]] = [newDepoimentos[index + 1], newDepoimentos[index]];

    setReordering(true);
    try {
      const orderedIds = newDepoimentos.map((dep) => dep._id);
      const response = await fetch('/api/admin/depoimentos-escritos/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderedIds),
      });

      if (response.ok) {
        setDepoimentos(newDepoimentos);
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

  const handleAdd = () => {
    window.location.href = '/admin/videos/depoimentos-escritos/novo';
  };

  if (loading) {
    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Depoimentos Escritos</h2>
        </div>
        <div className={styles.loading}>Carregando...</div>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <h2>Depoimentos Escritos</h2>
        </div>
        <button onClick={handleAdd} className={styles.addButton}>
          <FiPlus />
          Adicionar Depoimento Escrito
        </button>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Ordem</th>
              <th>Foto</th>
              <th>Nome</th>
              <th>Função</th>
              <th>Texto</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {depoimentos.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  Nenhum depoimento escrito cadastrado
                </td>
              </tr>
            ) : (
              depoimentos.map((depoimento, index) => (
                <tr key={depoimento._id}>
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
                        disabled={index === depoimentos.length - 1 || reordering}
                        className={styles.orderButton}
                        title="Mover para baixo"
                      >
                        <FiChevronDown />
                      </button>
                    </div>
                  </td>
                  <td>
                    {depoimento.imageUrl ? (
                      <img src={depoimento.imageUrl} alt={depoimento.name} className={styles.image} />
                    ) : (
                      <span className={styles.noImage}>Sem foto</span>
                    )}
                  </td>
                  <td>{depoimento.name}</td>
                  <td>{depoimento.role}</td>
                  <td>
                    <span className={styles.textPreview}>
                      {depoimento.text.substring(0, 100)}...
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link href={`/admin/videos/depoimentos-escritos/${depoimento._id}`} className={styles.actionButton}>
                        <FiEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(depoimento._id)}
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
  );
}
