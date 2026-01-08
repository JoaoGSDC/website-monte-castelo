import { NextResponse } from 'next/server';
import connectToDatabase from '../utils/dbConnect';

export async function GET() {
  try {
    const db = await connectToDatabase();
    const config = await db.collection('config').findOne({ type: 'images' });

    if (!config) {
      // Valores padrão
      const defaultData = {
        home: {
          whoWeAreImage: '/images/cursos-5.jpeg',
          depoimentsMainImage: '/images/aula.jpg',
          depoimentsTitleImage: '/images/background-5.jpg',
          ourCoursesImage: '/images/background-6.jpg',
        },
        quemSomos: {
          cover: '/images/places/frente.jpg',
          video: '/videos/video-1.mp4',
          carousel: [],
        },
        cursos: {
          sidebarImage: '/images/blog-cover.png',
        },
        blog: {
          cover: '/images/blog-cover.jpg',
        },
        logos: {
          logo: '/logo.png',
          logoBlack: '/logo-black.png',
        },
      };
      
      return NextResponse.json(defaultData, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      });
    }

    return NextResponse.json(config.data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Erro ao buscar imagens:', error);
    return NextResponse.json(
      {
        error: 'Erro ao buscar imagens',
      },
      { status: 500 }
    );
  }
}
