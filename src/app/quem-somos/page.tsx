import Image from 'next/image';
import styles from './styles.module.scss';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const IMAGES = [
  // FRENTE
  '/images/places/frente.jpg',

  // ENTRADA
  '/images/places/entrada-1.jpg',
  '/images/places/entrada-2.jpg',
  '/images/places/entrada-3.jpg',

  // STAND DE TIRO
  '/images/places/stand-de-tiro-7.jpg',
  '/images/places/stand-de-tiro-8.jpg',
  '/images/places/stand-de-tiro-1.jpg',
  '/images/places/stand-de-tiro-2.jpg',
  '/images/places/stand-de-tiro-3.jpg',
  '/images/places/stand-de-tiro-4.jpg',
  '/images/places/stand-de-tiro-5.jpg',
  '/images/places/stand-de-tiro-6.jpg',

  // RECEPÇÃO
  '/images/places/recepcao-1.jpg',
  '/images/places/recepcao-2.jpg',

  // SALA DE AULA
  '/images/places/sala-de-aula-1.jpg',
  '/images/places/sala-de-aula-2.jpg',
  '/images/places/sala-de-aula-3.jpg',

  // TIRO VIRTUAL
  '/images/places/tiro-virtual-1.jpg',
  '/images/places/tiro-virtual-2.jpg',
  '/images/places/tiro-virtual-3.jpg',

  // ACADEMIA
  '/images/places/academia-1.jpg',
  '/images/places/academia-2.jpg',
  '/images/places/academia-3.jpg',
  '/images/places/academia-4.jpg',
  '/images/places/academia-5.jpg',
  '/images/places/academia-6.jpg',

  // REFEITORIO
  '/images/places/refeitorio-1.jpg',
  '/images/places/refeitorio-2.jpg',
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
          <Image
            src="/images/places/frente.jpg"
            alt="Equipe Monte Castelo"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
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
