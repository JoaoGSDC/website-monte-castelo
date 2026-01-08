import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../utils/dbConnect';
import { requireAuth } from '@/lib/auth';

interface Depoimento {
  video: string;
  capa: string;
}

interface VideosConfig {
  videoInstitucional: string;
  depoimentos: Depoimento[];
}

export async function GET() {
  try {
    await requireAuth();

    const db = await connectToDatabase();
    const config = await db.collection('config').findOne({ type: 'videos' });

    if (!config) {
      // Valores padrão
      return NextResponse.json({
        videoInstitucional: '/videos/video-institucional.mp4',
        depoimentos: [
          { video: '/videos/depoimento-1.mp4', capa: '/images/depoimento-1.jpg' },
          { video: '/videos/depoimento-2.mp4', capa: '/images/depoimento-2.jpg' },
          { video: '/videos/depoimento-3.mp4', capa: '/images/depoimento-3.jpg' },
          { video: '/videos/depoimento-4.mp4', capa: '/images/depoimento-4.jpg' },
        ],
      });
    }

    // Migrar dados antigos se necessário
    if (config.data && !config.data.depoimentos) {
      const oldData = config.data;
      const depoimentos: Depoimento[] = [];
      
      if (oldData.depoimento1) depoimentos.push({ video: oldData.depoimento1, capa: '/images/depoimento-1.jpg' });
      if (oldData.depoimento2) depoimentos.push({ video: oldData.depoimento2, capa: '/images/depoimento-2.jpg' });
      if (oldData.depoimento3) depoimentos.push({ video: oldData.depoimento3, capa: '/images/depoimento-3.jpg' });
      if (oldData.depoimento4) depoimentos.push({ video: oldData.depoimento4, capa: '/images/depoimento-4.jpg' });

      return NextResponse.json({
        videoInstitucional: oldData.videoInstitucional || '/videos/video-institucional.mp4',
        depoimentos,
      });
    }

    return NextResponse.json(config.data);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao buscar depoimentos:', error);
    return NextResponse.json({ error: 'Erro ao buscar depoimentos' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAuth();

    const db = await connectToDatabase();
    const body = await request.json();

    await db.collection('config').updateOne(
      { type: 'videos' },
      { $set: { type: 'videos', data: body, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao salvar depoimentos:', error);
    return NextResponse.json({ error: 'Erro ao salvar depoimentos' }, { status: 500 });
  }
}
