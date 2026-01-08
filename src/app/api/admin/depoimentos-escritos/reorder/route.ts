import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../utils/dbConnect';
import { requireAuth } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function PUT(request: NextRequest) {
  try {
    await requireAuth();

    const db = await connectToDatabase();
    const orderedIds: string[] = await request.json();

    // Atualizar a ordem de cada depoimento
    const updatePromises = orderedIds.map((id, index) => {
      return db.collection('depoimentos-escritos').updateOne(
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
    console.error('Erro ao reordenar depoimentos escritos:', error);
    return NextResponse.json({ error: 'Erro ao reordenar depoimentos escritos' }, { status: 500 });
  }
}
