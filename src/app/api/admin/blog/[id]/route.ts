import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../utils/dbConnect';
import { requireAuth } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();

    const { id } = await context.params;
    const db = await connectToDatabase();
    const body = await request.json();

    const { title, slug, content, excerpt, image, category, author } = body;

    if (!title || !slug || !content || !excerpt || !image) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    // Verificar se slug já existe em outro post
    const existingPost = await db.collection('posts').findOne({ slug, _id: { $ne: new ObjectId(id) } });
    if (existingPost) {
      return NextResponse.json({ error: 'Slug já existe' }, { status: 400 });
    }

    const updateData = {
      title,
      slug,
      content,
      excerpt,
      image,
      category: category || '',
      author: author || '',
      updatedAt: new Date().toISOString(),
    };

    await db.collection('posts').updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao atualizar post:', error);
    return NextResponse.json({ error: 'Erro ao atualizar post' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();

    const { id } = await context.params;
    const db = await connectToDatabase();

    await db.collection('posts').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao excluir post:', error);
    return NextResponse.json({ error: 'Erro ao excluir post' }, { status: 500 });
  }
}

