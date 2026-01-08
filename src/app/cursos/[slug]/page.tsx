import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import styles from '../styles.module.scss';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Subtitle from '@/components/Subtitle';
import CoursesLeftBar from '@/components/CoursesLeftBar';
import CourseInformation from '@/components/CourseInformation';
import connectToDatabase from '@/app/api/utils/dbConnect';
import { ICourse } from '@/interfaces/course.interface';

async function getCourse(slug: string): Promise<ICourse | null> {
  try {
    const db = await connectToDatabase();
    const course = await db.collection('courses').findOne({ slug });
    
    if (!course) {
      return null;
    }

    return course as ICourse;
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);

  if (!course) {
    return {
      title: 'Curso não encontrado',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://academiamontecastelo.com.br';
  const courseImage = course.images && course.images.length > 0 
    ? (course.images[0].startsWith('http') ? course.images[0] : `${baseUrl}${course.images[0]}`)
    : `${baseUrl}/icon512x512.png`;

  return {
    title: `${course.title} - Academia Monte Castelo`,
    description: course.description || `Curso de ${course.title} oferecido pela Academia Monte Castelo. Formação profissional credenciada pela Polícia Federal.`,
    keywords: [
      course.title,
      'curso vigilante',
      'formação segurança',
      'academia monte castelo',
      'curso credenciado',
    ],
    openGraph: {
      title: `${course.title} - Academia Monte Castelo`,
      description: course.description || `Curso profissional de ${course.title}`,
      siteName: 'Academia Monte Castelo',
      url: `${baseUrl}/cursos/${course.slug}`,
      type: 'website',
      images: [
        {
          url: courseImage,
          width: 1200,
          height: 630,
          alt: course.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${course.title} - Academia Monte Castelo`,
      description: course.description || `Curso profissional de ${course.title}`,
      images: [courseImage],
    },
    alternates: {
      canonical: `${baseUrl}/cursos/${course.slug}`,
    },
  };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourse(slug);

  if (!course) {
    notFound();
  }

  const videoSrc = course.video || '/videos/video-institucional.mp4';
  const images = course.images && course.images.length > 0 ? course.images : [];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://academiamontecastelo.com.br';

  // Structured Data - Course
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description || course.backDescription,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'Academia Monte Castelo',
      url: baseUrl,
    },
    courseCode: course.slug,
    url: `${baseUrl}/cursos/${course.slug}`,
    image: images.length > 0 
      ? (images[0].startsWith('http') ? images[0] : `${baseUrl}${images[0]}`)
      : `${baseUrl}/icon512x512.png`,
    ...(course.video && {
      video: {
        '@type': 'VideoObject',
        url: course.video.startsWith('http') ? course.video : `${baseUrl}${course.video}`,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h1>{course.title}</h1>
            <h3>{course.subtitle}</h3>
          </div>

          <video width="320" height="240" controls={false} autoPlay muted loop>
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>

        <div className={styles.container}>
          <CoursesLeftBar />

          <div className={styles.content}>
            <Subtitle text="Sobre o curso" />
            {course.aboutCourse ? (
              <div dangerouslySetInnerHTML={{ __html: course.aboutCourse }} />
            ) : (
              <>
                <p>{course.description}</p>
                <p>{course.backDescription}</p>
              </>
            )}

            {course.courseInformation && <CourseInformation content={course.courseInformation} />}

            {course.requiredDocuments && (
              <>
                <Subtitle text="Documentos necessários" />
                <div dangerouslySetInnerHTML={{ __html: course.requiredDocuments }} />
              </>
            )}

            {images.length > 0 && (
              <div className={styles.carouselContainer}>
                <div className={styles.carousel}>
                  <Carousel className="w-full">
                    <CarouselContent>
                      {images.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="relative w-full aspect-video">
                            <figure className="w-full h-full">
                              <Image
                                src={image}
                                alt={`${course.title} - Imagem ${index + 1}`}
                                fill
                                className="object-cover rounded-lg"
                                sizes="100vw"
                              />
                            </figure>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
