import { NextResponse } from 'next/server';
import connectToDatabase from '../utils/dbConnect';

interface Depoimento {
  video: string;
  capa: string;
}

export async function GET() {
  try {
    const db = await connectToDatabase();
    const config = await db.collection('config').findOne({ type: 'videos' });

    const cacheHeaders = {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    };

    if (!config) {
      // Valores padrão
      return NextResponse.json(
        {
          videoInstitucional: '/videos/video-institucional.mp4',
          depoimentos: [
            { video: '/videos/depoimento-1.mp4', capa: '/images/depoimento-1.jpg' },
            { video: '/videos/depoimento-2.mp4', capa: '/images/depoimento-2.jpg' },
            { video: '/videos/depoimento-3.mp4', capa: '/images/depoimento-3.jpg' },
            { video: '/videos/depoimento-4.mp4', capa: '/images/depoimento-4.jpg' },
          ],
        },
        { headers: cacheHeaders }
      );
    }

    // Migrar dados antigos se necessário
    if (config.data && !config.data.depoimentos) {
      const oldData = config.data;
      const depoimentos: Depoimento[] = [];
      
      if (oldData.depoimento1) depoimentos.push({ video: oldData.depoimento1, capa: '/images/depoimento-1.jpg' });
      if (oldData.depoimento2) depoimentos.push({ video: oldData.depoimento2, capa: '/images/depoimento-2.jpg' });
      if (oldData.depoimento3) depoimentos.push({ video: oldData.depoimento3, capa: '/images/depoimento-3.jpg' });
      if (oldData.depoimento4) depoimentos.push({ video: oldData.depoimento4, capa: '/images/depoimento-4.jpg' });

      return NextResponse.json(
        {
          videoInstitucional: oldData.videoInstitucional || '/videos/video-institucional.mp4',
          depoimentos,
        },
        { headers: cacheHeaders }
      );
    }

    return NextResponse.json(config.data, { headers: cacheHeaders });
  } catch (error) {
    console.error('Erro ao buscar vídeos:', error);
    return NextResponse.json(
      {
        error: 'Erro ao buscar vídeos',
      },
      { status: 500 }
    );
  }
}
