import Link from 'next/link';
import { RiPoliceBadgeFill } from 'react-icons/ri';
import styles from './styles.module.scss';
import Image from 'next/image';
import connectToDatabase from '@/app/api/utils/dbConnect';
import { ICourse } from '@/interfaces/course.interface';

async function getCourses(): Promise<ICourse[]> {
  try {
    const db = await connectToDatabase();
    const courses = await db.collection('courses').find({}).sort({ title: 1 }).toArray();
    return courses as ICourse[];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

export default async function CoursesLeftBar() {
  const courses = await getCourses();

  return (
    <aside className={styles.leftBarContainer}>
      <ul className={styles.leftBar}>
        {courses.map((course) => (
          <li key={course._id || course.slug}>
            <Link href={`/cursos/${course.slug}`}>{course.title}</Link>
          </li>
        ))}
      </ul>

      <div className={styles.infoContainer}>
        <div className={styles.icon}>
          <RiPoliceBadgeFill />
        </div>

        <h1>Formar com Excelência é nosso compromisso</h1>
        <p>Quer ser um profissional de segurança preparado?</p>

        <a
          href="https://forms.gle/c3JLdbkw3S5rPWZ39"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.contactLink}
        >
          Inscreva-se
        </a>

        <figure>
          <Image
            src="/images/blog-cover.png"
            alt="Cursos da Academia Monte Castelo"
            width={400}
            height={200}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </figure>
      </div>
    </aside>
  );
}
