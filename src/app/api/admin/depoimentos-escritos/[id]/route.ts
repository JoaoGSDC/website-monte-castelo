import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../utils/dbConnect';
import { requireAuth } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { deleteFileByUrl, isGridFSUrl } from '../../../utils/gridfs-cleanup';
import { getCacheInvalidationHeaders } from '../../../utils/cache';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();

    const { id } = await context.params;
    const db = await connectToDatabase();
    const body = await request.json();

    // Validar campos obrigatórios
    if (!body.text || !body.name || !body.role || !body.imageUrl) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 });
    }

    // Buscar depoimento existente para comparar imageUrl
    const existingDepoimento = await db.collection('depoimentos-escritos').findOne({ _id: new ObjectId(id) });

    // Se a imageUrl foi alterada e a antiga é do GridFS, deletá-la
    if (existingDepoimento?.imageUrl && existingDepoimento.imageUrl !== body.imageUrl && isGridFSUrl(existingDepoimento.imageUrl)) {
      await deleteFileByUrl(existingDepoimento.imageUrl);
    }

    await db.collection('depoimentos-escritos').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          text: body.text,
          name: body.name,
          role: body.role,
          imageUrl: body.imageUrl,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    return NextResponse.json(
      { success: true },
      { headers: getCacheInvalidationHeaders(['depoimentos-escritos']) }
    );
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao atualizar depoimento escrito:', error);
    return NextResponse.json({ error: 'Erro ao atualizar depoimento escrito' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();

    const { id } = await context.params;
    const db = await connectToDatabase();

    // Buscar depoimento antes de deletar para limpar arquivos GridFS
    const depoimento = await db.collection('depoimentos-escritos').findOne({ _id: new ObjectId(id) });

    if (depoimento?.imageUrl && isGridFSUrl(depoimento.imageUrl)) {
      // Deletar imagem do GridFS
      await deleteFileByUrl(depoimento.imageUrl);
    }

    // Deletar do banco de dados
    await db.collection('depoimentos-escritos').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json(
      { success: true },
      { headers: getCacheInvalidationHeaders(['depoimentos-escritos']) }
    );
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao excluir depoimento escrito:', error);
    return NextResponse.json({ error: 'Erro ao excluir depoimento escrito' }, { status: 500 });
  }
}
