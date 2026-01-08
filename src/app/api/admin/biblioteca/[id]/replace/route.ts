import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../../utils/dbConnect';
import { requireAuth } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { uploadToGridFS, deleteFromGridFS } from '../../../../utils/gridfs';
import { getCacheInvalidationHeaders } from '../../../../utils/cache';

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();

    const { id } = await context.params;

    if (id === 'default-document') {
      return NextResponse.json({ error: 'Não é possível substituir o arquivo padrão' }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Apenas arquivos PDF são permitidos' }, { status: 400 });
    }

    const db = await connectToDatabase();

    // Buscar arquivo existente
    const existingFile = await db.collection('library').findOne({ _id: new ObjectId(id) });

    if (!existingFile) {
      return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 });
    }

    // Remover arquivo antigo do GridFS se existir
    if (existingFile.fileId && existingFile.url !== '/documento.pdf') {
      try {
        await deleteFromGridFS(existingFile.fileId);
      } catch (error) {
        console.error('Erro ao remover arquivo antigo do GridFS:', error);
        // Continuar mesmo se houver erro ao remover o arquivo antigo
      }
    }

    // Upload novo arquivo para GridFS
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name}`;
    const newFileId = await uploadToGridFS(buffer, fileName, file.type, {
      category: 'biblioteca',
    });

    // Atualizar no banco de dados
    const newUrl = `/api/files/${newFileId.toString()}`;
    await db.collection('library').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          fileId: newFileId.toString(),
          url: newUrl,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    return NextResponse.json(
      { success: true, url: newUrl },
      { headers: getCacheInvalidationHeaders(['biblioteca', 'library']) }
    );
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao substituir arquivo:', error);
    return NextResponse.json({ error: 'Erro ao substituir arquivo' }, { status: 500 });
  }
}
