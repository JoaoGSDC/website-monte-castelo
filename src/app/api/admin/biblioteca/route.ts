import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../utils/dbConnect';
import { requireAuth } from '@/lib/auth';
import { uploadToGridFS } from '../../utils/gridfs';

export async function GET() {
  try {
    await requireAuth();

    const db = await connectToDatabase();
    // Buscar arquivos ordenando por campo 'order' se existir, caso contrário por createdAt
    const files = await db
      .collection('library')
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    // Se não houver arquivos, retornar um arquivo padrão
    if (files.length === 0) {
      return NextResponse.json([
        {
          _id: 'default-document',
          name: 'Documento',
          url: '/documento.pdf',
          createdAt: new Date().toISOString(),
        },
      ]);
    }

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

    // Gerar nome único para o arquivo
    const fileName = `${Date.now()}-${file.name}`;

    // Upload para GridFS
    const fileId = await uploadToGridFS(buffer, fileName, file.type, {
      category: 'biblioteca',
    });

    // Salvar no banco de dados
    const db = await connectToDatabase();
    const customName = formData.get('name') as string;
    const libraryFile = {
      name: customName || file.name,
      fileId: fileId.toString(), // Armazenar ObjectId como string
      url: `/api/files/${fileId.toString()}`, // URL da API de download
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

