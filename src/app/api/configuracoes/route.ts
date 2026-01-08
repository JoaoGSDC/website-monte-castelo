import { NextResponse } from 'next/server';
import connectToDatabase from '../utils/dbConnect';

export async function GET() {
  try {
    const db = await connectToDatabase();
    const config = await db.collection('config').findOne({ type: 'configuracoes' });

    const cacheHeaders = {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    };

    if (!config) {
      // Valores padrão (sem informações sensíveis de SMTP)
      return NextResponse.json(
        {
          social: {
            instagram: '',
            facebook: '',
            whatsapp: '',
          },
          contato: {
            email: '',
            endereco: '',
            googleMapsUrl: '',
          },
        },
        { headers: cacheHeaders }
      );
    }

    // Retornar apenas dados públicos (sem SMTP)
    const publicData = {
      social: config.data.social || {
        instagram: '',
        facebook: '',
        whatsapp: '',
      },
      contato: config.data.contato || {
        email: '',
        endereco: '',
        googleMapsUrl: '',
      },
    };

    return NextResponse.json(publicData, { headers: cacheHeaders });
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return NextResponse.json(
      {
        error: 'Erro ao buscar configurações',
      },
      { status: 500 }
    );
  }
}
