import { MetadataRoute } from 'next';
import connectToDatabase from '@/app/api/utils/dbConnect';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://academiamontecastelo.com.br';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // URLs estáticas
    const staticUrls: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/quem-somos`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/cursos`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
    ];

    // Buscar cursos dinâmicos
    let courseUrls: MetadataRoute.Sitemap = [];
    try {
      const db = await connectToDatabase();
      const courses = await db.collection('courses').find({}).toArray();

      courseUrls = courses.map((course) => ({
        url: `${baseUrl}/cursos/${course.slug}`,
        lastModified: course.updatedAt ? new Date(course.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    } catch (error) {
      console.error('Erro ao buscar cursos para sitemap:', error);
    }

    // Buscar posts do blog dinâmicos
    let blogUrls: MetadataRoute.Sitemap = [];
    try {
      const db = await connectToDatabase();
      const posts = await db.collection('posts').find({}).toArray();

      blogUrls = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
    } catch (error) {
      console.error('Erro ao buscar posts para sitemap:', error);
    }

    return [...staticUrls, ...courseUrls, ...blogUrls];
  } catch (error) {
    console.error('Erro ao gerar sitemap:', error);
    // Retornar pelo menos as URLs estáticas em caso de erro
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}
