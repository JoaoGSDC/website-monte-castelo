import { NextResponse } from 'next/server';
import connectToDatabase from '../utils/dbConnect';

export async function GET() {
  try {
    const db = await connectToDatabase();
    // Buscar arquivos ordenando por campo 'order' se existir, caso contrário por createdAt
    const files = await db
      .collection('library')
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    const cacheHeaders = {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    };

    // Se não houver arquivos, retornar um arquivo padrão
    if (files.length === 0) {
      return NextResponse.json(
        [
          {
            _id: 'default-document',
            name: 'Documento',
            url: '/documento.pdf',
            createdAt: new Date().toISOString(),
          },
        ],
        { headers: cacheHeaders }
      );
    }

    // Retornar apenas os campos necessários para o frontend
    return NextResponse.json(
      files.map((file: any) => ({
        _id: file._id.toString(),
        name: file.name,
        url: file.url,
      })),
      { headers: cacheHeaders }
    );
  } catch (error) {
    console.error('Erro ao buscar arquivos da biblioteca:', error);
    return NextResponse.json(
      {
        error: 'Erro ao buscar arquivos da biblioteca',
      },
      { status: 500 }
    );
  }
}
