import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../utils/dbConnect';
import { requireAuth } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();

    const { id } = await context.params;
    const db = await connectToDatabase();
    const body = await request.json();

    if (id === 'default-document') {
      return NextResponse.json({ error: 'Não é possível editar o arquivo padrão' }, { status: 400 });
    }

    await db.collection('library').updateOne(
      { _id: new ObjectId(id) },
      { $set: { name: body.name, updatedAt: new Date().toISOString() } }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao atualizar arquivo:', error);
    return NextResponse.json({ error: 'Erro ao atualizar arquivo' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();

    const { id } = await context.params;
    
    if (id === 'default-document') {
      return NextResponse.json({ error: 'Não é possível excluir o arquivo padrão' }, { status: 400 });
    }

    const db = await connectToDatabase();

    // Buscar arquivo
    const file = await db.collection('library').findOne({ _id: new ObjectId(id) });

    if (file) {
      // Remover arquivo físico
      try {
        const filePath = join(process.cwd(), 'public', file.url);
        await unlink(filePath);
      } catch (error) {
        console.error('Erro ao remover arquivo físico:', error);
      }
    }

    // Remover do banco de dados
    await db.collection('library').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao excluir arquivo:', error);
    return NextResponse.json({ error: 'Erro ao excluir arquivo' }, { status: 500 });
  }
}
