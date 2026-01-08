import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../utils/dbConnect';
import { requireAuth } from '@/lib/auth';
import { noCacheHeaders, getCacheInvalidationHeaders } from '../../utils/cache';

export async function GET() {
  try {
    await requireAuth();

    const db = await connectToDatabase();
    const courses = await db.collection('courses').find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json(courses, {
      headers: noCacheHeaders,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao buscar cursos:', error);
    return NextResponse.json({ error: 'Erro ao buscar cursos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const db = await connectToDatabase();
    const body = await request.json();

    const { title, slug, subtitle, description, backDescription, icon, video, images, aboutCourse, courseInformation, requiredDocuments } = body;

    if (!title || !slug || !subtitle || !description || !backDescription || !icon || !aboutCourse || !courseInformation || !requiredDocuments) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    // Verificar se slug já existe
    const existingCourse = await db.collection('courses').findOne({ slug });
    if (existingCourse) {
      return NextResponse.json({ error: 'Slug já existe' }, { status: 400 });
    }

    const course = {
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await db.collection('courses').insertOne(course);

    return NextResponse.json(
      { _id: result.insertedId, ...course },
      { headers: getCacheInvalidationHeaders(['courses']) }
    );
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao criar curso:', error);
    return NextResponse.json({ error: 'Erro ao criar curso' }, { status: 500 });
  }
}

