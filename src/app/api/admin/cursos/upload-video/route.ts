import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { uploadToGridFS } from '../../../utils/gridfs';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    // Validar tipo de arquivo
    if (!file.type.startsWith('video/')) {
      return NextResponse.json({ error: 'Apenas arquivos de vídeo são permitidos' }, { status: 400 });
    }

    // Validar tamanho
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Arquivo muito grande. Tamanho máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}-${sanitizedName}`;

    // Upload para GridFS
    const fileId = await uploadToGridFS(buffer, fileName, file.type, {
      category: 'course-videos',
    });

    // Retornar URL da API de download
    const videoUrl = `/api/files/${fileId.toString()}`;

    return NextResponse.json({ url: videoUrl });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao enviar vídeo:', error);
    return NextResponse.json({ error: 'Erro ao enviar vídeo' }, { status: 500 });
  }
}
