import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../utils/dbConnect';
import { requireAuth } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();

    const { id } = await context.params;
    const db = await connectToDatabase();

    const course = await db.collection('courses').findOne({ _id: new ObjectId(id) });

    if (!course) {
      return NextResponse.json({ error: 'Curso não encontrado' }, { status: 404 });
    }

    return NextResponse.json(course);
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

    const { title, slug, subtitle, description, backDescription, video, images } = body;

    if (!title || !slug || !subtitle || !description || !backDescription) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    // Verificar se slug já existe em outro curso
    const existingCourse = await db.collection('courses').findOne({ slug, _id: { $ne: new ObjectId(id) } });
    if (existingCourse) {
      return NextResponse.json({ error: 'Slug já existe' }, { status: 400 });
    }

    const updateData = {
      title,
      slug,
      subtitle,
      description,
      backDescription,
      video: video || '',
      images: images || [],
      updatedAt: new Date().toISOString(),
    };

    await db.collection('courses').updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    return NextResponse.json({ success: true });
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

    await db.collection('courses').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao excluir curso:', error);
    return NextResponse.json({ error: 'Erro ao excluir curso' }, { status: 500 });
  }
}

