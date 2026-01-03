import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../utils/dbConnect';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    await requireAuth();

    const db = await connectToDatabase();
    const config = await db.collection('config').findOne({ type: 'videos' });

    if (!config) {
      // Valores padrão
      return NextResponse.json({
        videoInstitucional: '/videos/video-institucional.mp4',
        depoimento1: '/videos/depoimento-1.mp4',
        depoimento2: '/videos/depoimento-2.mp4',
        depoimento3: '/videos/depoimento-3.mp4',
        depoimento4: '/videos/depoimento-4.mp4',
        video1: '/videos/video-1.mp4',
      });
    }

    return NextResponse.json(config.data);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao buscar vídeos:', error);
    return NextResponse.json({ error: 'Erro ao buscar vídeos' }, { status: 500 });
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
    console.error('Erro ao salvar vídeos:', error);
    return NextResponse.json({ error: 'Erro ao salvar vídeos' }, { status: 500 });
  }
}

