import { GridFSBucket, ObjectId } from 'mongodb';
import connectToDatabase from './dbConnect';

let gridfsBucket: GridFSBucket | null = null;

/**
 * Obtém ou cria uma instância do GridFSBucket
 */
async function getGridFSBucket(): Promise<GridFSBucket> {
  if (gridfsBucket) {
    return gridfsBucket;
  }

  const db = await connectToDatabase();
  gridfsBucket = new GridFSBucket(db, { bucketName: 'files' });

  return gridfsBucket;
}

/**
 * Interface para metadados do arquivo
 */
export interface FileMetadata {
  filename: string;
  contentType: string;
  size: number;
  uploadDate: Date;
  metadata?: {
    originalName?: string;
    category?: string;
    [key: string]: any;
  };
}

/**
 * Faz upload de um arquivo para o GridFS
 * @param buffer Buffer do arquivo
 * @param filename Nome do arquivo
 * @param contentType MIME type do arquivo
 * @param metadata Metadados adicionais opcionais
 * @returns ObjectId do arquivo no GridFS
 */
export async function uploadToGridFS(
  buffer: Buffer,
  filename: string,
  contentType: string,
  metadata?: Record<string, any>
): Promise<ObjectId> {
  const bucket = await getGridFSBucket();

  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      contentType,
      metadata: {
        originalName: filename,
        uploadDate: new Date(),
        ...metadata,
      },
    });

    uploadStream.on('finish', () => {
      resolve(uploadStream.id);
    });

    uploadStream.on('error', (error) => {
      reject(error);
    });

    uploadStream.end(buffer);
  });
}

/**
 * Deleta um arquivo do GridFS
 * @param fileId ObjectId do arquivo
 */
export async function deleteFromGridFS(fileId: ObjectId | string): Promise<void> {
  const bucket = await getGridFSBucket();
  const objectId = typeof fileId === 'string' ? new ObjectId(fileId) : fileId;

  try {
    await bucket.delete(objectId);
  } catch (error: any) {
    // Ignorar erro se arquivo não existir (código de erro do MongoDB)
    const errorMessage = error?.message || String(error || '');
    if (errorMessage.includes('FileNotFound') || errorMessage.includes('not found')) {
      return; // Arquivo já não existe, considerar sucesso
    }
    throw error; // Re-lançar outros erros
  }
}

/**
 * Obtém informações sobre um arquivo no GridFS
 * @param fileId ObjectId do arquivo
 * @returns Informações do arquivo ou null se não encontrado
 */
export async function getFileInfo(fileId: ObjectId | string): Promise<FileMetadata | null> {
  const bucket = await getGridFSBucket();
  const objectId = typeof fileId === 'string' ? new ObjectId(fileId) : fileId;

  try {
    const files = await bucket.find({ _id: objectId }).toArray();

    if (files.length === 0) {
      return null;
    }

    const file = files[0];

    return {
      filename: file.filename,
      contentType: file.contentType || 'application/octet-stream',
      size: file.length,
      uploadDate: file.uploadDate,
      metadata: file.metadata || {},
    };
  } catch (error) {
    console.error('Erro ao buscar informações do arquivo:', error);
    return null;
  }
}

/**
 * Obtém um stream de leitura do arquivo do GridFS
 * @param fileId ObjectId do arquivo
 * @returns Stream de leitura ou null se não encontrado
 */
export async function getFileStream(fileId: ObjectId | string): Promise<NodeJS.ReadableStream | null> {
  const bucket = await getGridFSBucket();
  const objectId = typeof fileId === 'string' ? new ObjectId(fileId) : fileId;

  try {
    // Verificar se o arquivo existe
    const fileInfo = await getFileInfo(objectId);
    if (!fileInfo) {
      return null;
    }

    return bucket.openDownloadStream(objectId);
  } catch (error) {
    console.error('Erro ao obter stream do arquivo:', error);
    return null;
  }
}

/**
 * Download completo de um arquivo do GridFS como Buffer
 * @param fileId ObjectId do arquivo
 * @returns Buffer do arquivo ou null se não encontrado
 */
export async function downloadFromGridFS(fileId: ObjectId | string): Promise<Buffer | null> {
  const stream = await getFileStream(fileId);

  if (!stream) {
    return null;
  }

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    stream.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    stream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    stream.on('error', (error) => {
      reject(error);
    });
  });
}
