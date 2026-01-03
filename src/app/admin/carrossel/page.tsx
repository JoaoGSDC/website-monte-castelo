'use client';

import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { FiPlus, FiTrash2, FiSave } from 'react-icons/fi';

interface CarouselItem {
  image: string;
  hollowText: string;
  title: string;
  titleMarked: string;
  buttonPrimary: string;
  buttonSecondary: string;
}

export default function CarrosselPage() {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCarousel();
  }, []);

  const fetchCarousel = async () => {
    try {
      const response = await fetch('/api/admin/carrossel');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Erro ao buscar carrossel:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/carrossel', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(items),
      });

      if (response.ok) {
        alert('Carrossel salvo com sucesso!');
      } else {
        alert('Erro ao salvar carrossel');
      }
    } catch (error) {
      console.error('Erro ao salvar carrossel:', error);
      alert('Erro ao salvar carrossel');
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = () => {
    setItems([
      ...items,
      {
        image: '',
        hollowText: '',
        title: '',
        titleMarked: '',
        buttonPrimary: '',
        buttonSecondary: '',
      },
    ]);
  };

  const handleRemove = (index: number) => {
    if (confirm('Tem certeza que deseja remover este item?')) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleChange = (index: number, field: keyof CarouselItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
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

      <form onSubmit={handleSubmit}>
        <div className={styles.itemsList}>
          {items.length === 0 ? (
            <div className={styles.empty}>Nenhum item no carrossel</div>
          ) : (
            items.map((item, index) => (
              <div key={index} className={styles.itemCard}>
                <div className={styles.itemHeader}>
                  <h3>Item {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className={styles.removeButton}
                  >
                    <FiTrash2 />
                  </button>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Imagem (URL) *</label>
                    <input
                      type="url"
                      value={item.image}
                      onChange={(e) => handleChange(index, 'image', e.target.value)}
                      required
                      placeholder="/images/background-1.png"
                    />
                    {item.image && (
                      <div className={styles.preview}>
                        <img src={item.image} alt={`Preview ${index + 1}`} />
                      </div>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Texto Oco *</label>
                    <input
                      type="text"
                      value={item.hollowText}
                      onChange={(e) => handleChange(index, 'hollowText', e.target.value)}
                      required
                      placeholder="Invista no"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Título *</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleChange(index, 'title', e.target.value)}
                      required
                      placeholder="seu futuro"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Título Marcado *</label>
                    <input
                      type="text"
                      value={item.titleMarked}
                      onChange={(e) => handleChange(index, 'titleMarked', e.target.value)}
                      required
                      placeholder="profissional"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Botão Primário *</label>
                    <input
                      type="text"
                      value={item.buttonPrimary}
                      onChange={(e) => handleChange(index, 'buttonPrimary', e.target.value)}
                      required
                      placeholder="Nossos cursos"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Botão Secundário *</label>
                    <input
                      type="text"
                      value={item.buttonSecondary}
                      onChange={(e) => handleChange(index, 'buttonSecondary', e.target.value)}
                      required
                      placeholder="Entrar em contato"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.submitButton} disabled={saving || items.length === 0}>
            <FiSave />
            {saving ? 'Salvando...' : 'Salvar Carrossel'}
          </button>
        </div>
      </form>
    </div>
  );
}

