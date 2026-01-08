import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../utils/dbConnect';
import { requireAuth } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { deleteFilesByUrls, filterGridFSUrls } from '../../../utils/gridfs-cleanup';
import { noCacheHeaders, getCacheInvalidationHeaders } from '../../../utils/cache';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();

    const { id } = await context.params;
    const db = await connectToDatabase();

    const course = await db.collection('courses').findOne({ _id: new ObjectId(id) });

    if (!course) {
      return NextResponse.json({ error: 'Curso não encontrado' }, { status: 404 });
    }

    return NextResponse.json(course, {
      headers: noCacheHeaders,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao buscar curso:', error);
    return NextResponse.json({ error: 'Erro ao buscar curso' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();

    const { id } = await context.params;
    const db = await connectToDatabase();
    const body = await request.json();

    const { title, slug, subtitle, description, backDescription, icon, video, images, aboutCourse, courseInformation, requiredDocuments } = body;

    if (!title || !slug || !subtitle || !description || !backDescription || !icon || !aboutCourse || !courseInformation || !requiredDocuments) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    // Buscar curso existente para comparar e limpar arquivos não utilizados
    const existingCourse = await db.collection('courses').findOne({ _id: new ObjectId(id) });
    if (!existingCourse) {
      return NextResponse.json({ error: 'Curso não encontrado' }, { status: 404 });
    }

    // Verificar se slug já existe em outro curso
    const courseWithSameSlug = await db.collection('courses').findOne({ slug, _id: { $ne: new ObjectId(id) } });
    if (courseWithSameSlug) {
      return NextResponse.json({ error: 'Slug já existe' }, { status: 400 });
    }

    // Coletar URLs antigas que não serão mais usadas
    const oldUrls: string[] = [];
    
    // Comparar vídeo
    if (existingCourse.video && existingCourse.video !== video) {
      oldUrls.push(existingCourse.video);
    }
    
    // Comparar imagens - encontrar imagens removidas
    const oldImages = (existingCourse.images || []) as string[];
    const newImages = (images || []) as string[];
    const removedImages = oldImages.filter(img => !newImages.includes(img));
    oldUrls.push(...removedImages);

    // Deletar arquivos GridFS que não são mais utilizados
    const gridFSUrls = filterGridFSUrls(oldUrls);
    if (gridFSUrls.length > 0) {
      await deleteFilesByUrls(gridFSUrls);
    }

    const updateData = {
      title,
      slug,
      subtitle,
      description,
      backDescription,
      icon,
      video: video || '',
      images: images || [],
      aboutCourse,
      courseInformation,
      requiredDocuments,
      updatedAt: new Date().toISOString(),
    };

    await db.collection('courses').updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    return NextResponse.json(
      { success: true },
      { headers: getCacheInvalidationHeaders(['courses', `course-${slug}`]) }
    );
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao atualizar curso:', error);
    return NextResponse.json({ error: 'Erro ao atualizar curso' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();

    const { id } = await context.params;
    const db = await connectToDatabase();

    // Buscar curso antes de deletar para limpar arquivos GridFS
    const course = await db.collection('courses').findOne({ _id: new ObjectId(id) });

    if (course) {
      // Coletar todas as URLs de arquivos GridFS do curso
      const urlsToDelete: string[] = [];

      if (course.video) {
        urlsToDelete.push(course.video);
      }

      if (Array.isArray(course.images)) {
        urlsToDelete.push(...course.images);
      }

      // Deletar arquivos GridFS
      const gridFSUrls = filterGridFSUrls(urlsToDelete);
      if (gridFSUrls.length > 0) {
        await deleteFilesByUrls(gridFSUrls);
      }
    }

    // Deletar do banco de dados
    await db.collection('courses').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json(
      { success: true },
      { headers: getCacheInvalidationHeaders(['courses']) }
    );
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao excluir curso:', error);
    return NextResponse.json({ error: 'Erro ao excluir curso' }, { status: 500 });
  }
}

