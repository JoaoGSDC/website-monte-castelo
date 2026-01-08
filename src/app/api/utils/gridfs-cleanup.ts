import { deleteFromGridFS } from './gridfs';
import { ObjectId } from 'mongodb';

/**
 * Extrai o fileId de uma URL do GridFS
 * URLs do GridFS são no formato: /api/files/{fileId}
 * @param url URL do arquivo
 * @returns fileId extraído ou null se não for uma URL válida do GridFS
 */
export function extractFileIdFromUrl(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Verificar se é uma URL do GridFS
  if (url.startsWith('/api/files/')) {
    const fileId = url.replace('/api/files/', '').split('?')[0]; // Remove query params se houver
    
    // Validar se é um ObjectId válido
    if (ObjectId.isValid(fileId)) {
      return fileId;
    }
  }

  return null;
}

/**
 * Deleta um arquivo do GridFS a partir de sua URL
 * @param url URL do arquivo (/api/files/{fileId})
 */
export async function deleteFileByUrl(url: string): Promise<void> {
  const fileId = extractFileIdFromUrl(url);
  
  if (fileId) {
    try {
      await deleteFromGridFS(fileId);
    } catch (error) {
      console.error(`Erro ao deletar arquivo GridFS por URL ${url}:`, error);
      // Não lançar erro - continuar mesmo se falhar
    }
  }
}

/**
 * Deleta múltiplos arquivos do GridFS a partir de suas URLs
 * @param urls Array de URLs dos arquivos
 */
export async function deleteFilesByUrls(urls: string[]): Promise<void> {
  if (!Array.isArray(urls) || urls.length === 0) {
    return;
  }

  const deletePromises = urls.map(url => deleteFileByUrl(url));
  
  try {
    await Promise.allSettled(deletePromises);
  } catch (error) {
    console.error('Erro ao deletar múltiplos arquivos GridFS:', error);
    // Não lançar erro - continuar mesmo se alguns falharem
  }
}

/**
 * Verifica se uma URL é de um arquivo GridFS
 * @param url URL para verificar
 * @returns true se for uma URL do GridFS
 */
export function isGridFSUrl(url: string): boolean {
  return url?.startsWith('/api/files/') || false;
}

/**
 * Retorna apenas URLs que são do GridFS, filtrando URLs estáticas
 * @param urls Array de URLs
 * @returns Array com apenas URLs do GridFS
 */
export function filterGridFSUrls(urls: string[]): string[] {
  if (!Array.isArray(urls)) {
    return [];
  }

  return urls.filter(url => isGridFSUrl(url));
}
