import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../utils/dbConnect';
import { requireAuth } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function PUT(request: NextRequest) {
  try {
    await requireAuth();

    const db = await connectToDatabase();
    const orderedIds: string[] = await request.json();

    // Atualizar a ordem de cada arquivo
    const updatePromises = orderedIds.map((id, index) => {
      if (id === 'default-document') {
        return Promise.resolve(); // Pular o arquivo padrão
      }
      return db.collection('library').updateOne(
        { _id: new ObjectId(id) },
        { $set: { order: index, updatedAt: new Date().toISOString() } }
      );
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao reordenar arquivos:', error);
    return NextResponse.json({ error: 'Erro ao reordenar arquivos' }, { status: 500 });
  }
}
