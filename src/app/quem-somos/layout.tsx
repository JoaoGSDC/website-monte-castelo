import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://academiamontecastelo.com.br';

export const metadata: Metadata = {
  title: 'Quem Somos',
  description:
    'Conheça a Academia Monte Castelo: fundada em 2014, somos referência em formação de vigilantes em Limeira-SP. Infraestrutura moderna com estande de tiro indoor, salas climatizadas, tatames e instrutores credenciados pela Polícia Federal.',
  keywords: [
    'academia monte castelo',
    'quem somos',
    'história academia monte castelo',
    'infraestrutura curso vigilante',
    'estande de tiro limeira',
    'instrutores credenciados polícia federal',
  ],
  openGraph: {
    title: 'Quem Somos - Academia Monte Castelo',
    description:
      'Conheça a Academia Monte Castelo: referência em formação de vigilantes desde 2014. Infraestrutura moderna e instrutores qualificados.',
    url: `${baseUrl}/quem-somos`,
    type: 'website',
    images: [
      {
        url: `${baseUrl}/icon512x512.png`,
        width: 1200,
        height: 630,
        alt: 'Academia Monte Castelo',
      },
    ],
  },
  alternates: {
    canonical: `${baseUrl}/quem-somos`,
  },
};

export default function QuemSomosLayout({ children }: { children: React.ReactNode }) {
  // Structured Data - AboutPage
  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Quem Somos - Academia Monte Castelo',
    description:
      'Academia Monte Castelo: referência em formação de vigilantes em Limeira-SP desde 2014. Infraestrutura moderna com estande de tiro indoor, salas climatizadas e instrutores credenciados.',
    url: `${baseUrl}/quem-somos`,
    mainEntity: {
      '@type': 'EducationalOrganization',
      name: 'Academia Monte Castelo',
      foundingDate: '2014',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Limeira',
        addressRegion: 'SP',
        addressCountry: 'BR',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      {children}
    </>
  );
}
