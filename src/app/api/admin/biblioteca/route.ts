import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../utils/dbConnect';
import { requireAuth } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET() {
  try {
    await requireAuth();

    const db = await connectToDatabase();
    const files = await db.collection('library').find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json(files);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao buscar arquivos:', error);
    return NextResponse.json({ error: 'Erro ao buscar arquivos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Apenas arquivos PDF são permitidos' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Criar diretório se não existir
    const uploadDir = join(process.cwd(), 'public', 'biblioteca');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Salvar arquivo
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // Salvar no banco de dados
    const db = await connectToDatabase();
    const libraryFile = {
      name: file.name,
      url: `/biblioteca/${fileName}`,
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection('library').insertOne(libraryFile);

    return NextResponse.json({ _id: result.insertedId, ...libraryFile });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao enviar arquivo:', error);
    return NextResponse.json({ error: 'Erro ao enviar arquivo' }, { status: 500 });
  }
}

