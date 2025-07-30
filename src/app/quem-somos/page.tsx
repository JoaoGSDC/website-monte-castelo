import Image from 'next/image';
import styles from './styles.module.scss';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const IMAGES = [
  '/images/cursos-1.jpeg',
  '/images/cursos-2.jpeg',
  '/images/cursos-3.jpeg',
  '/images/cursos-4.jpeg',
  '/images/cursos-5.jpeg',
];

export default function QuemSomosPage() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Quem Nós Somos</h1>
          <h2>Excelência em formação de profissionais de segurança</h2>
        </div>
        <div className={styles.headerImage}>
          <Image src="/images/blog-cover.jpg" alt="Equipe Monte Castelo" fill style={{ objectFit: 'cover' }} priority />
        </div>
      </header>

      <div className={styles.container}>
        <section className={styles.aboutSection}>
          <div className={styles.aboutText}>
            <h3>Sobre a Academia Monte Castelo</h3>
            <p>
              Fundada em 2014, a Academia Monte Castelo tornou-se referência na formação de vigilantes e profissionais
              de segurança privada em Limeira-SP e toda a região. Nossa missão é capacitar com excelência, ética e
              inovação, preparando nossos alunos para os desafios do mercado de trabalho e para atuarem com
              responsabilidade e competência em diferentes segmentos da segurança privada.
            </p>
            <p>
              Ao longo dos anos, investimos continuamente em infraestrutura moderna, tecnologia de ponta e atualização
              de nossos métodos de ensino. Nossa equipe é composta por instrutores altamente qualificados e
              credenciados, com vasta experiência prática e didática, garantindo um aprendizado sólido e alinhado às
              exigências da Polícia Federal.
            </p>
            <p>
              Oferecemos cursos completos e atualizados, com aulas teóricas e práticas, simuladores, estande de tiro
              indoor automatizado, salas climatizadas, tatames para defesa pessoal e alojamentos confortáveis. Nosso
              compromisso é proporcionar um ambiente seguro, acolhedor e motivador, onde cada aluno possa desenvolver
              suas habilidades técnicas, comportamentais e éticas.
            </p>
            <p>
              Acreditamos que a formação de um bom profissional vai além do conteúdo programático: envolve valores,
              disciplina, respeito e a busca constante pela excelência. Por isso, acompanhamos de perto o
              desenvolvimento de nossos alunos, oferecendo suporte individualizado e incentivando o crescimento pessoal
              e profissional de cada um.
            </p>
          </div>

          <figure className={styles.aboutImage}>
            <video width={400} height={300} controls={false} autoPlay muted loop>
              <source src="/videos/video-1.mp4" type="video/mp4" />
              Seu navegador não suporta o elemento de vídeo.
            </video>
          </figure>
        </section>

        <section className={styles.valuesSection}>
          <h3>Nossos diferenciais</h3>
          <ul>
            <li>Estande de tiro indoor automatizado</li>
            <li>Sala fitness e tatames para defesa pessoal</li>
            <li>Salas de aula e auditório climatizados</li>
            <li>CFTV com câmeras Bosch e sala de rádio comunicação</li>
            <li>Alojamentos masculinos e femininos</li>
          </ul>
        </section>

        <div className={styles.carouselContainer}>
          <div className={styles.carousel}>
            <Carousel className="w-full">
              <CarouselContent>
                {IMAGES.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative w-full aspect-video">
                      <figure className="w-full h-full">
                        <Image
                          src={image}
                          alt={`Imagem ${index + 1}`}
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
      </div>
    </main>
  );
}
