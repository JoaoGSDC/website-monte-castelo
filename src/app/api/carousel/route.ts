import { NextResponse } from 'next/server';
import connectToDatabase from '../utils/dbConnect';

export async function GET() {
  try {
    const db = await connectToDatabase();
    const config = await db.collection('config').findOne({ type: 'carousel' });

    const cacheHeaders = {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    };

    if (!config || !config.data || !Array.isArray(config.data)) {
      // Valores padrão
      return NextResponse.json(
        [
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
        ],
        { headers: cacheHeaders }
      );
    }

    return NextResponse.json(config.data, { headers: cacheHeaders });
  } catch (error) {
    console.error('Erro ao buscar carrossel:', error);
    return NextResponse.json(
      {
        error: 'Erro ao buscar carrossel',
      },
      { status: 500 }
    );
  }
}
