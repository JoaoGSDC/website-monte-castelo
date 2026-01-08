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
        home: {
          whoWeAreImage: '/images/cursos-5.jpeg',
          depoimentsMainImage: '/images/aula.jpg',
          depoimentsTitleImage: '/images/background-5.jpg',
          ourCoursesImage: '/images/background-6.jpg',
        },
        quemSomos: {
          cover: '/images/places/frente.jpg',
          video: '/videos/video-1.mp4',
          carousel: [],
        },
        cursos: {
          sidebarImage: '/images/blog-cover.png',
        },
        blog: {
          cover: '/images/blog-cover.jpg',
        },
        logos: {
          logo: '/logo.png',
          logoBlack: '/logo-black.png',
        },
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

