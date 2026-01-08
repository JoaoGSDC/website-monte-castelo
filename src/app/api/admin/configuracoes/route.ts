import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../utils/dbConnect';
import { requireAuth } from '@/lib/auth';
import { noCacheHeaders, getCacheInvalidationHeaders } from '../../utils/cache';

interface Configuracoes {
  social: {
    instagram: string;
    facebook: string;
    whatsapp: string;
  };
  contato: {
    email: string;
    endereco: string;
    googleMapsUrl: string;
  };
  smtp: {
    host: string;
    port: number;
    secure: boolean; // true para porta 465, false para outras portas
    user: string;
    password: string;
    fromEmail: string;
    fromName: string;
  };
}

export async function GET() {
  try {
    await requireAuth();

    const db = await connectToDatabase();
    const config = await db.collection('config').findOne({ type: 'configuracoes' });

    if (!config) {
      // Valores padrão
      return NextResponse.json({
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
        smtp: {
          host: '',
          port: 587,
          secure: false,
          user: '',
          password: '',
          fromEmail: '',
          fromName: '',
        },
      }, {
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
    console.error('Erro ao buscar configurações:', error);
    return NextResponse.json({ error: 'Erro ao buscar configurações' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAuth();

    const db = await connectToDatabase();
    const body: Configuracoes = await request.json();

    // Validações básicas
    if (body.smtp.port && (body.smtp.port < 1 || body.smtp.port > 65535)) {
      return NextResponse.json({ error: 'Porta SMTP inválida' }, { status: 400 });
    }

    await db.collection('config').updateOne(
      { type: 'configuracoes' },
      { $set: { type: 'configuracoes', data: body, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );

    return NextResponse.json(
      { success: true },
      { headers: getCacheInvalidationHeaders(['configuracoes', 'config']) }
    );
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao salvar configurações:', error);
    return NextResponse.json({ error: 'Erro ao salvar configurações' }, { status: 500 });
  }
}
