import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../utils/dbConnect';
import { requireAuth } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { deleteFileByUrl, isGridFSUrl } from '../../../utils/gridfs-cleanup';
import { getCacheInvalidationHeaders } from '../../../utils/cache';

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

    // Buscar post existente para comparar imagem
    const existingPost = await db.collection('posts').findOne({ _id: new ObjectId(id) });
    if (!existingPost) {
      return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
    }

    // Verificar se slug já existe em outro post
    const postWithSameSlug = await db.collection('posts').findOne({ slug, _id: { $ne: new ObjectId(id) } });
    if (postWithSameSlug) {
      return NextResponse.json({ error: 'Slug já existe' }, { status: 400 });
    }

    // Se a imagem foi alterada e a antiga é do GridFS, deletá-la
    if (existingPost.image && existingPost.image !== image && isGridFSUrl(existingPost.image)) {
      await deleteFileByUrl(existingPost.image);
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

    return NextResponse.json(
      { success: true },
      { headers: getCacheInvalidationHeaders(['posts', `post-${slug}`]) }
    );
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

    // Buscar post antes de deletar para limpar arquivos GridFS
    const post = await db.collection('posts').findOne({ _id: new ObjectId(id) });

    if (post && post.image && isGridFSUrl(post.image)) {
      // Deletar imagem do GridFS
      await deleteFileByUrl(post.image);
    }

    // Deletar do banco de dados
    await db.collection('posts').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json(
      { success: true },
      { headers: getCacheInvalidationHeaders(['posts']) }
    );
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao excluir post:', error);
    return NextResponse.json({ error: 'Erro ao excluir post' }, { status: 500 });
  }
}

