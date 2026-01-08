import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getFileInfo, getFileStream } from '../../utils/gridfs';

/**
 * Rota para servir arquivos do GridFS
 * GET /api/files/[fileId]
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await context.params;

    // Validar ObjectId
    if (!ObjectId.isValid(fileId)) {
      return NextResponse.json({ error: 'ID de arquivo inválido' }, { status: 400 });
    }

    // Obter informações do arquivo
    const fileInfo = await getFileInfo(fileId);

    if (!fileInfo) {
      return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 });
    }

    // Obter stream do arquivo
    const fileStream = await getFileStream(fileId);

    if (!fileStream) {
      return NextResponse.json({ error: 'Erro ao obter arquivo' }, { status: 500 });
    }

    // Converter stream para buffer
    const chunks: Buffer[] = [];
    for await (const chunk of fileStream) {
      // Garantir que o chunk seja um Buffer
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);

    // Retornar arquivo com headers apropriados
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': fileInfo.contentType,
        'Content-Length': fileInfo.size.toString(),
        'Content-Disposition': `inline; filename="${encodeURIComponent(fileInfo.filename)}"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Erro ao servir arquivo:', error);
    return NextResponse.json({ error: 'Erro ao servir arquivo' }, { status: 500 });
  }
}
