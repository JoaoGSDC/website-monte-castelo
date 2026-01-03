import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../utils/dbConnect';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const db = await connectToDatabase();
    const body = await request.json();

    const { title, slug, content, excerpt, image, category, author } = body;

    if (!title || !slug || !content || !excerpt || !image) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    // Verificar se slug já existe
    const existingPost = await db.collection('posts').findOne({ slug });
    if (existingPost) {
      return NextResponse.json({ error: 'Slug já existe' }, { status: 400 });
    }

    const post = {
      title,
      slug,
      content,
      excerpt,
      image,
      category: category || '',
      author: author || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await db.collection('posts').insertOne(post);

    return NextResponse.json({ _id: result.insertedId, ...post });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao criar post:', error);
    return NextResponse.json({ error: 'Erro ao criar post' }, { status: 500 });
  }
}

