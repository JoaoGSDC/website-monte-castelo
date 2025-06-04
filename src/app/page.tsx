import Carousel from '@/components/Carousel';
import styles from '../styles/app.module.scss';
import OurCourses from '@/sections/OurCourses';
import LastBlogPosts from '@/sections/LastBlogPosts';
import WhoWeAre from '@/sections/WhoWeAre';
import Depoiments from '@/sections/Depoiments';
import Contact from '@/sections/Contact';
import { IPost } from '@/interfaces/post.interface';
import api from '@/services/api';
import Highlights from '@/components/Highlights';

const getLatestPosts = async () => {
  try {
    const res = await api.get<IPost[]>(`/posts/last`);
    const posts = res.data;

    return posts;
  } catch (error) {
    console.error('Error fetching latest posts:', error);
    return [];
  }
};

export default async function Home() {
  const lastestPosts: IPost[] = await getLatestPosts();

  return (
    <>
      <div className={styles.page}>
        <main className={styles.main}>
          <Carousel
            items={[
              {
                image: '/images/background-1.png',
                hollowText: 'Invista no',
                title: 'seu futuro',
                titleMarked: 'profissional',
                buttonPrimary: 'Saiba mais',
                buttonSecondary: 'Entrar em contato',
              },
            ]}
          />
          <OurCourses />

          <LastBlogPosts posts={lastestPosts} />

          <WhoWeAre />

          <Depoiments />

          <Contact />
        </main>
      </div>
    </>
  );
}
