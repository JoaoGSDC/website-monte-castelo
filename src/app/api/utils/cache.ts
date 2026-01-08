/**
 * Utilitário para gerenciar cache e revalidação
 */

/**
 * Headers para respostas públicas com cache curto
 * Permite atualizações rápidas após mudanças no admin
 */
export const shortCacheHeaders = {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300', // Cache de 1 minuto, serve stale por 5 minutos
};

/**
 * Headers para respostas que não devem ser cacheadas
 * Usado em rotas admin para garantir dados sempre frescos
 */
export const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
};

/**
 * Headers para invalidar cache após alterações no admin
 * Adiciona headers que forçam revalidação imediata
 */
export function getCacheInvalidationHeaders(tags?: string[]): Record<string, string> {
  const headers: Record<string, string> = {
    ...noCacheHeaders,
    'X-Cache-Invalidated': 'true',
    'X-Timestamp': new Date().toISOString(),
  };

  if (tags && tags.length > 0) {
    headers['Cache-Tags'] = tags.join(',');
  }

  return headers;
}
