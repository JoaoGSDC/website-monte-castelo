import { useState, useEffect } from 'react';

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
}

export function useConfiguracoes() {
  const [configuracoes, setConfiguracoes] = useState<Configuracoes>({
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
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfiguracoes = async () => {
      try {
        const response = await fetch('/api/configuracoes');
        if (response.ok) {
          const data = await response.json();
          setConfiguracoes({
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
          });
        }
      } catch (error) {
        console.error('Erro ao buscar configurações:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfiguracoes();
  }, []);

  // Formatar WhatsApp para URL
  const getWhatsAppUrl = (message?: string) => {
    if (!configuracoes.social.whatsapp) return '';
    const phone = configuracoes.social.whatsapp.replace(/\D/g, ''); // Remove não-numéricos
    const encodedMessage = message ? encodeURIComponent(message) : '';
    return `https://api.whatsapp.com/send?phone=${phone}${encodedMessage ? `&text=${encodedMessage}` : ''}`;
  };

  // Formatar telefone para exibição
  const formatPhone = (phone: string) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  return {
    configuracoes,
    loading,
    getWhatsAppUrl,
    formatPhone,
  };
}
