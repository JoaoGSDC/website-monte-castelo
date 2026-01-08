'use client';

import Carousel from '@/components/Carousel';
import { useApiCache } from '@/hooks/useApiCache';

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

export default function CarouselData() {
  const { data: items, loading } = useApiCache<CarouselItem[]>('/api/carousel');

  if (loading) {
    return <div style={{ minHeight: '400px' }} />; // Espaço reservado durante carregamento
  }

  const itemsList = Array.isArray(items) ? items : [];
  
  if (itemsList.length === 0) {
    return null; // Não mostrar nada se não houver itens
  }

  return <Carousel items={itemsList} />;
}
