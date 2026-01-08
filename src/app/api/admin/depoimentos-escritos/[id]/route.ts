import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../utils/dbConnect';
import { requireAuth } from '@/lib/auth';
import { ObjectId } from 'mongodb';

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

    return NextResponse.json({ success: true });
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

    await db.collection('depoimentos-escritos').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao excluir depoimento escrito:', error);
    return NextResponse.json({ error: 'Erro ao excluir depoimento escrito' }, { status: 500 });
  }
}
