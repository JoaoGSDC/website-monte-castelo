'use client';

import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { FiSave } from 'react-icons/fi';

interface Configuracoes {
  social: {
    instagram: string;
    facebook: string;
    whatsapp: string;
  };
  contato: {
    email: string;
    endereco: string;
    googleMapsUrl: string;
  };
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    password: string;
    fromEmail: string;
    fromName: string;
  };
}

export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Configuracoes>({
    social: {
      instagram: '',
      facebook: '',
      whatsapp: '',
    },
    contato: {
      email: '',
      endereco: '',
      googleMapsUrl: '',
    },
    smtp: {
      host: '',
      port: 587,
      secure: false,
      user: '',
      password: '',
      fromEmail: '',
      fromName: '',
    },
  });

  useEffect(() => {
    fetchConfiguracoes();
  }, []);

  const fetchConfiguracoes = async () => {
    try {
      const response = await fetch('/api/admin/configuracoes');
      if (response.ok) {
        const data = await response.json();
        setFormData({
          social: {
            instagram: data.social?.instagram || '',
            facebook: data.social?.facebook || '',
            whatsapp: data.social?.whatsapp || '',
          },
          contato: {
            email: data.contato?.email || '',
            endereco: data.contato?.endereco || '',
            googleMapsUrl: data.contato?.googleMapsUrl || '',
          },
          smtp: {
            host: data.smtp?.host || '',
            port: data.smtp?.port || 587,
            secure: data.smtp?.secure !== undefined ? data.smtp.secure : false,
            user: data.smtp?.user || '',
            password: data.smtp?.password || '',
            fromEmail: data.smtp?.fromEmail || '',
            fromName: data.smtp?.fromName || '',
          },
        });
      }
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/configuracoes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Configurações salvas com sucesso!');
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao salvar configurações');
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Configurações</h1>
          <p>Configure as informações de contato e integração do website</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Seção Redes Sociais */}
        <div className={styles.section}>
          <h2>Redes Sociais</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="instagram">Instagram</label>
              <input
                type="text"
                id="instagram"
                value={formData.social.instagram}
                onChange={(e) => setFormData((prev) => ({ ...prev, social: { ...prev.social, instagram: e.target.value } }))}
                placeholder="https://instagram.com/usuario"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="facebook">Facebook</label>
              <input
                type="text"
                id="facebook"
                value={formData.social.facebook}
                onChange={(e) => setFormData((prev) => ({ ...prev, social: { ...prev.social, facebook: e.target.value } }))}
                placeholder="https://facebook.com/pagina"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="whatsapp">WhatsApp</label>
              <input
                type="text"
                id="whatsapp"
                value={formData.social.whatsapp}
                onChange={(e) => setFormData((prev) => ({ ...prev, social: { ...prev.social, whatsapp: e.target.value } }))}
                placeholder="5519999999999"
              />
              <small className={styles.helpText}>Apenas números com código do país (ex: 5519999999999)</small>
            </div>
          </div>
        </div>

        {/* Seção Contato */}
        <div className={styles.section}>
          <h2>Informações de Contato</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                value={formData.contato.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, contato: { ...prev.contato, email: e.target.value } }))}
                placeholder="contato@exemplo.com"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="endereco">Endereço</label>
              <input
                type="text"
                id="endereco"
                value={formData.contato.endereco}
                onChange={(e) => setFormData((prev) => ({ ...prev, contato: { ...prev.contato, endereco: e.target.value } }))}
                placeholder="Rua Exemplo, 123 - Cidade, Estado"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="googleMapsUrl">URL do Google Maps</label>
              <input
                type="text"
                id="googleMapsUrl"
                value={formData.contato.googleMapsUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, contato: { ...prev.contato, googleMapsUrl: e.target.value } }))}
                placeholder="https://maps.google.com/..."
              />
              <small className={styles.helpText}>Link de compartilhamento do Google Maps</small>
            </div>
          </div>
        </div>

        {/* Seção SMTP */}
        <div className={styles.section}>
          <h2>Configurações SMTP (Envio de E-mails)</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="smtpHost">Host SMTP</label>
              <input
                type="text"
                id="smtpHost"
                value={formData.smtp.host}
                onChange={(e) => setFormData((prev) => ({ ...prev, smtp: { ...prev.smtp, host: e.target.value } }))}
                placeholder="smtp.gmail.com"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="smtpPort">Porta SMTP</label>
              <input
                type="number"
                id="smtpPort"
                value={formData.smtp.port}
                onChange={(e) => {
                  const port = parseInt(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    smtp: {
                      ...prev.smtp,
                      port: port || 587,
                      secure: port === 465,
                    },
                  }));
                }}
                placeholder="587"
              />
              <small className={styles.helpText}>Porta 465 (SSL) ou 587 (TLS)</small>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="smtpSecure">
                <input
                  type="checkbox"
                  id="smtpSecure"
                  checked={formData.smtp.secure}
                  onChange={(e) => setFormData((prev) => ({ ...prev, smtp: { ...prev.smtp, secure: e.target.checked } }))}
                />
                <span>Usar SSL/TLS seguro</span>
              </label>
              <small className={styles.helpText}>Marque se usar porta 465</small>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="smtpUser">Usuário/E-mail SMTP</label>
              <input
                type="email"
                id="smtpUser"
                value={formData.smtp.user}
                onChange={(e) => setFormData((prev) => ({ ...prev, smtp: { ...prev.smtp, user: e.target.value } }))}
                placeholder="usuario@gmail.com"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="smtpPassword">Senha SMTP</label>
              <input
                type="password"
                id="smtpPassword"
                value={formData.smtp.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, smtp: { ...prev.smtp, password: e.target.value } }))}
                placeholder="Senha ou senha de app"
              />
              <small className={styles.helpText}>Para Gmail, use uma senha de app</small>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="fromEmail">E-mail Remetente</label>
              <input
                type="email"
                id="fromEmail"
                value={formData.smtp.fromEmail}
                onChange={(e) => setFormData((prev) => ({ ...prev, smtp: { ...prev.smtp, fromEmail: e.target.value } }))}
                placeholder="noreply@exemplo.com"
              />
              <small className={styles.helpText}>E-mail que aparecerá como remetente</small>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="fromName">Nome Remetente</label>
              <input
                type="text"
                id="fromName"
                value={formData.smtp.fromName}
                onChange={(e) => setFormData((prev) => ({ ...prev, smtp: { ...prev.smtp, fromName: e.target.value } }))}
                placeholder="Academia Monte Castelo"
              />
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.submitButton} disabled={saving}>
            <FiSave />
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </form>
    </div>
  );
}
