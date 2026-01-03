import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../utils/dbConnect';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    await requireAuth();

    const db = await connectToDatabase();
    const config = await db.collection('config').findOne({ type: 'images' });

    if (!config) {
      // Valores padrão
      return NextResponse.json({
        logo: '/logo.png',
        logoBlack: '/logo-black.png',
        blogCover: '/images/blog-cover.jpg',
        blogPostsCover: '/images/blog-posts-cover.png',
        quemSomosHeader: '',
        cursosHeader: '',
        contactHeader: '',
      });
    }

    return NextResponse.json(config.data);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao buscar imagens:', error);
    return NextResponse.json({ error: 'Erro ao buscar imagens' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAuth();

    const db = await connectToDatabase();
    const body = await request.json();

    await db.collection('config').updateOne(
      { type: 'images' },
      { $set: { type: 'images', data: body, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao salvar imagens:', error);
    return NextResponse.json({ error: 'Erro ao salvar imagens' }, { status: 500 });
  }
}

