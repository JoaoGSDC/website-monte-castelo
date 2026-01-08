import { Barlow } from 'next/font/google';
import type { Metadata } from 'next';
import '../styles/globals.css';
import '../styles/globals.scss';
import ConditionalLayout from '@/components/ConditionalLayout';
import connectToDatabase from '@/app/api/utils/dbConnect';

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://academiamontecastelo.com.br';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Academia Monte Castelo - Formação de Vigilantes em Limeira-SP',
    template: '%s | Academia Monte Castelo',
  },
  description:
    'Academia Monte Castelo: referência em formação, extensão e atualização de vigilantes em Limeira-SP. Cursos credenciados pela Polícia Federal com infraestrutura moderna, estande de tiro, salas climatizadas e instrutores qualificados.',
  keywords: [
    'academia monte castelo',
    'curso de vigilante',
    'formação de vigilante',
    'vigilante limeira',
    'curso vigilante sp',
    'formação segurança privada',
    'atualização vigilante',
    'estande de tiro',
    'curso credenciado polícia federal',
    'academia segurança limeira',
  ],
  authors: [{ name: 'Academia Monte Castelo' }],
  creator: 'Academia Monte Castelo',
  publisher: 'Academia Monte Castelo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: baseUrl,
    siteName: 'Academia Monte Castelo',
    title: 'Academia Monte Castelo - Formação de Vigilantes em Limeira-SP',
    description:
      'Referência em formação, extensão e atualização de vigilantes. Cursos credenciados pela Polícia Federal com infraestrutura moderna e instrutores qualificados.',
    images: [
      {
        url: `${baseUrl}/icon512x512.png`,
        width: 1200,
        height: 630,
        alt: 'Academia Monte Castelo - Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Academia Monte Castelo - Formação de Vigilantes',
    description:
      'Referência em formação, extensão e atualização de vigilantes. Cursos credenciados pela Polícia Federal.',
    images: [`${baseUrl}/icon512x512.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Adicione seus códigos de verificação aqui quando disponíveis
    // google: 'seu-codigo-google',
    // yandex: 'seu-codigo-yandex',
    // bing: 'seu-codigo-bing',
  },
  alternates: {
    canonical: baseUrl,
  },
  category: 'Education',
};

async function getConfiguracoes() {
  try {
    const db = await connectToDatabase();
    const config = await db.collection('config').findOne({ type: 'configuracoes' });
    if (config?.data) {
      return {
        social: config.data.social || { instagram: '', facebook: '', whatsapp: '' },
        contato: config.data.contato || { email: '', endereco: '', googleMapsUrl: '' },
      };
    }
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
  }
  return null;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://academiamontecastelo.com.br';
  const config = await getConfiguracoes();

  // Structured Data - Organization
  const sameAs: string[] = [];
  if (config?.social?.instagram) sameAs.push(config.social.instagram);
  if (config?.social?.facebook) sameAs.push(config.social.facebook);

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Academia Monte Castelo',
    alternateName: 'Monte Castelo',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      'Academia especializada em formação, extensão e atualização de vigilantes e profissionais de segurança privada em Limeira-SP.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: config?.contato?.endereco || '',
      addressLocality: 'Limeira',
      addressRegion: 'SP',
      addressCountry: 'BR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: config?.contato?.whatsapp || '+55-19-97410-2924',
      email: config?.contato?.email || '',
      contactType: 'Atendimento',
      areaServed: 'BR',
      availableLanguage: 'pt-BR',
    },
    ...(sameAs.length > 0 && { sameAs }),
  };

  return (
    <html lang="pt-BR" className={barlow.className}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon512x512.png" />
        <meta name="theme-color" content="#F57C30" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>

      <body style={{ margin: 0, padding: 0 }}>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
