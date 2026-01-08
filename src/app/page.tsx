import { Metadata } from 'next';
import styles from '../styles/app.module.scss';
import OurCourses from '@/sections/OurCourses';
import LastBlogPosts from '@/sections/LastBlogPosts';
import WhoWeAre from '@/sections/WhoWeAre';
import Depoiments from '@/sections/Depoiments';
import Contact from '@/sections/Contact';
import { IPost } from '@/interfaces/post.interface';
import CoursesListModal from '@/components/CoursesListModal';
import CarouselData from '@/components/CarouselData';
import connectToDatabase from '@/app/api/utils/dbConnect';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://academiamontecastelo.com.br';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Academia Monte Castelo: referência em formação de vigilantes em Limeira-SP. Cursos credenciados pela Polícia Federal com infraestrutura moderna, estande de tiro indoor, salas climatizadas e instrutores altamente qualificados.',
  openGraph: {
    title: 'Academia Monte Castelo - Formação de Vigilantes',
    description:
      'Referência em formação, extensão e atualização de vigilantes. Cursos credenciados pela Polícia Federal.',
    url: baseUrl,
    images: [
      {
        url: `${baseUrl}/icon512x512.png`,
        width: 1200,
        height: 630,
        alt: 'Academia Monte Castelo',
      },
    ],
  },
};

const getLatestPosts = async (): Promise<IPost[]> => {
  try {
    // Em Server Components, é mais eficiente chamar o banco diretamente
    // O Next.js fará cache automático através do ISR (Incremental Static Regeneration)
    const db = await connectToDatabase();
    const posts = await db.collection('posts').find({}).sort({ createdAt: -1 }).limit(3).toArray();
    
    return (posts as IPost[]) || [];
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching latest posts:', error?.message || error);
    }
    // Retornar array vazio em caso de erro para não quebrar a página
    return [];
  }
};

export default async function Home() {
  const latestPosts: IPost[] = await getLatestPosts();

  // Structured Data - WebSite with SearchAction
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Academia Monte Castelo',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/blog?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <div className={styles.page}>
        <main className={styles.main}>
          <CarouselData />
          <WhoWeAre />

          <Depoiments />

          <OurCourses />

          <LastBlogPosts posts={latestPosts} />

          <Contact />
        </main>
      </div>

      <CoursesListModal />
    </>
  );
}
