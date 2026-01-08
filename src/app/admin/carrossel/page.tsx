'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './styles.module.scss';
import { FiPlus, FiEdit, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi';

interface CarouselItem {
  image: string;
  hollowText?: string;
  title?: string;
  titleMarked?: string;
  buttonPrimary?: string;
  buttonPrimaryLink?: string;
  buttonSecondary?: string;
  buttonSecondaryLink?: string;
}

export default function CarrosselPage() {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);

  useEffect(() => {
    fetchCarousel();
  }, []);

  const fetchCarousel = async () => {
    try {
      const response = await fetch('/api/admin/carrossel');
      if (response.ok) {
        const data = await response.json();
        setItems(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Erro ao buscar carrossel:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index: number) => {
    if (!confirm('Tem certeza que deseja remover este item?')) return;

    try {
      const newItems = items.filter((_, i) => i !== index);
      const response = await fetch('/api/admin/carrossel', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItems),
      });

      if (response.ok) {
        setItems(newItems);
        alert('Item removido com sucesso!');
      } else {
        alert('Erro ao remover item');
      }
    } catch (error) {
      console.error('Erro ao remover item:', error);
      alert('Erro ao remover item');
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;

    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];

    setReordering(true);
    try {
      const response = await fetch('/api/admin/carrossel', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItems),
      });

      if (response.ok) {
        setItems(newItems);
      } else {
        alert('Erro ao reordenar item');
      }
    } catch (error) {
      console.error('Erro ao reordenar item:', error);
      alert('Erro ao reordenar item');
    } finally {
      setReordering(false);
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === items.length - 1) return;

    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];

    setReordering(true);
    try {
      const response = await fetch('/api/admin/carrossel', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItems),
      });

      if (response.ok) {
        setItems(newItems);
      } else {
        alert('Erro ao reordenar item');
      }
    } catch (error) {
      console.error('Erro ao reordenar item:', error);
      alert('Erro ao reordenar item');
    } finally {
      setReordering(false);
    }
  };

  const handleAdd = async () => {
    const newItem: CarouselItem = {
      image: '',
      hollowText: '',
      title: '',
      titleMarked: '',
      buttonPrimary: '',
      buttonPrimaryLink: '',
      buttonSecondary: '',
      buttonSecondaryLink: '',
    };

    const newItems = [...items, newItem];

    try {
      const response = await fetch('/api/admin/carrossel', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItems),
      });

      if (response.ok) {
        setItems(newItems);
        // Redirecionar para a página de edição do novo item
        window.location.href = `/admin/carrossel/${newItems.length - 1}`;
      } else {
        alert('Erro ao adicionar item');
      }
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      alert('Erro ao adicionar item');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Gerenciar Carrossel</h1>
          <p>Gerencie os itens do carrossel da página inicial</p>
        </div>
        <button onClick={handleAdd} className={styles.addButton}>
          <FiPlus />
          Adicionar Item
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Ordem</th>
              <th>Imagem</th>
              <th>Texto Oco</th>
              <th>Título</th>
              <th>Título Marcado</th>
              <th>Botão Primário</th>
              <th>Botão Secundário</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.empty}>
                  Nenhum item no carrossel
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
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
                        disabled={index === items.length - 1 || reordering}
                        className={styles.orderButton}
                        title="Mover para baixo"
                      >
                        <FiChevronDown />
                      </button>
                    </div>
                  </td>
                  <td>
                    {item.image ? (
                      <img src={item.image} alt={`Item ${index + 1}`} className={styles.image} />
                    ) : (
                      <span className={styles.noImage}>Sem imagem</span>
                    )}
                  </td>
                  <td>{item.hollowText || '-'}</td>
                  <td>{item.title || '-'}</td>
                  <td>{item.titleMarked || '-'}</td>
                  <td>{item.buttonPrimary || '-'}</td>
                  <td>{item.buttonSecondary || '-'}</td>
                  <td>
                    <div className={styles.actions}>
                      <Link href={`/admin/carrossel/${index}`} className={styles.actionButton}>
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
  );
}
