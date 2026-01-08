import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../utils/dbConnect';
import { requireAuth } from '@/lib/auth';
import { noCacheHeaders, getCacheInvalidationHeaders } from '../../utils/cache';
import { deleteFilesByUrls, filterGridFSUrls } from '../../utils/gridfs-cleanup';

export async function GET() {
  try {
    await requireAuth();

    const db = await connectToDatabase();
    const config = await db.collection('config').findOne({ type: 'carousel' });

    if (!config) {
      // Valores padrão
      return NextResponse.json([
        {
          image: '/images/background-1.png',
          hollowText: 'Invista no',
          title: 'seu futuro',
          titleMarked: 'profissional',
          buttonPrimary: 'Nossos cursos',
          buttonPrimaryLink: '/cursos',
          buttonSecondary: 'Entrar em contato',
          buttonSecondaryLink: 'https://forms.gle/c3JLdbkw3S5rPWZ39',
        },
        {
          image: '/images/background-4.png',
          hollowText: 'Excelência',
          title: 'na formação de',
          titleMarked: 'vigilantes',
          buttonPrimary: 'Saiba mais',
          buttonPrimaryLink: '/cursos',
          buttonSecondary: 'Entrar em contato',
          buttonSecondaryLink: 'https://forms.gle/c3JLdbkw3S5rPWZ39',
        },
      ], {
        headers: noCacheHeaders,
      });
    }

    return NextResponse.json(config.data, {
      headers: noCacheHeaders,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao buscar carrossel:', error);
    return NextResponse.json({ error: 'Erro ao buscar carrossel' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAuth();

    const db = await connectToDatabase();
    const body = await request.json();

    // Buscar configuração existente para comparar imagens
    const existingConfig = await db.collection('config').findOne({ type: 'carousel' });
    
    if (existingConfig && existingConfig.data && Array.isArray(existingConfig.data)) {
      // Coletar URLs antigas de imagens que não serão mais usadas
      const oldImageUrls: string[] = [];
      const existingImages = existingConfig.data.map((item: any) => item.image).filter(Boolean);
      const newImages = (body || []).map((item: any) => item.image).filter(Boolean);
      
      // Encontrar imagens removidas
      const removedImages = existingImages.filter((img: string) => !newImages.includes(img));
      oldImageUrls.push(...removedImages);

      // Deletar arquivos GridFS que não são mais utilizados
      const gridFSUrls = filterGridFSUrls(oldImageUrls);
      if (gridFSUrls.length > 0) {
        await deleteFilesByUrls(gridFSUrls);
      }
    }

    await db.collection('config').updateOne(
      { type: 'carousel' },
      { $set: { type: 'carousel', data: body, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );

    return NextResponse.json(
      { success: true },
      { headers: getCacheInvalidationHeaders(['carousel', 'config']) }
    );
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao salvar carrossel:', error);
    return NextResponse.json({ error: 'Erro ao salvar carrossel' }, { status: 500 });
  }
}

