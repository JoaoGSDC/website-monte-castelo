'use client';

import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import button from '../../styles/button.module.scss';
import Subtitle from '@/components/Subtitle';

const DEFAULT_MAPS_URL = 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3684.8147022663925!2d-47.378772!3d-22.548613!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fdfeecccebf6b1%3A0xe30c62ec78f271eb!2sAcademia%20Monte%20Castelo!5e0!3m2!1spt-BR!2sbr!4v1738373492662!5m2!1spt-BR!2sbr';

export default function Contact() {
  const [mapsUrl, setMapsUrl] = useState(DEFAULT_MAPS_URL);

  useEffect(() => {
    const fetchConfiguracoes = async () => {
      try {
        const response = await fetch('/api/configuracoes');
        if (response.ok) {
          const data = await response.json();
          if (data.contato?.googleMapsUrl) {
            setMapsUrl(data.contato.googleMapsUrl);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar configurações:', error);
      }
    };

    fetchConfiguracoes();
  }, []);

  return (
    <section id="contato" className={styles.container}>
      <Subtitle text="Contato" />
      <h1>Entre em contato conosco</h1>

      <div className={styles.content}>
        <form
          className={styles.form}
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = {
              name: formData.get('name'),
              phone: formData.get('phone'),
              email: formData.get('email'),
              subject: formData.get('subject'),
              message: formData.get('message'),
            };

            try {
              const response = await fetch('/api/contact/send', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
              });

              if (response.ok) {
                alert('Mensagem enviada com sucesso!');
                (e.target as HTMLFormElement).reset();
              } else {
                const error = await response.json();
                alert(error.error || 'Erro ao enviar mensagem');
              }
            } catch (error) {
              console.error('Erro ao enviar mensagem:', error);
              alert('Erro ao enviar mensagem');
            }
          }}
        >
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
          src={mapsUrl}
          style={{ border: 0, flex: 1 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
}
