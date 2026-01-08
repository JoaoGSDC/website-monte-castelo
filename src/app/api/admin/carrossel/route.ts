import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../utils/dbConnect';
import { requireAuth } from '@/lib/auth';

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
      ]);
    }

    return NextResponse.json(config.data);
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

    await db.collection('config').updateOne(
      { type: 'carousel' },
      { $set: { type: 'carousel', data: body, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao salvar carrossel:', error);
    return NextResponse.json({ error: 'Erro ao salvar carrossel' }, { status: 500 });
  }
}

