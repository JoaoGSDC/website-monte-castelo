import styles from './styles.module.scss';
import button from '../../styles/button.module.scss';
import Subtitle from '@/components/Subtitle';
import { sendEmail } from '@/app/contact/actions';

export default function Contact() {
  return (
    <section id="contato" className={styles.container}>
      <Subtitle text="Contato" />
      <h1>Entre em contato conosco</h1>

      <div className={styles.content}>
        <form className={styles.form} action={sendEmail}>
          <input type="text" name="name" placeholder="Nome *" required />
          <input type="tel" name="phone" placeholder="Telefone *" required />
          <input type="email" name="email" placeholder="E-mail *" required />
          <input type="text" name="subject" placeholder="Assunto" />
          <textarea name="message" placeholder="Mensagem *" required />

          <button type="submit" className={button.primaryVariant}>
            Enviar
          </button>
        </form>

        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3684.8147022663925!2d-47.378772!3d-22.548613!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fdfeecccebf6b1%3A0xe30c62ec78f271eb!2sAcademia%20Monte%20Castelo!5e0!3m2!1spt-BR!2sbr!4v1738373492662!5m2!1spt-BR!2sbr"
          style={{ border: 0, flex: 1 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
}
