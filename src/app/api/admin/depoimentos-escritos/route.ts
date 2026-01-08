import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../utils/dbConnect';
import { requireAuth } from '@/lib/auth';
import { ObjectId } from 'mongodb';

interface DepoimentoEscrito {
  _id?: string;
  text: string;
  name: string;
  role: string;
  imageUrl: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export async function GET() {
  try {
    await requireAuth();

    const db = await connectToDatabase();
    const depoimentos = await db
      .collection('depoimentos-escritos')
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    // Se não houver depoimentos, inicializar com os padrão
    if (depoimentos.length === 0) {
      const depoimentosPadrao = [
        {
          text: 'Formado recentemente no curso de vigilante na academia Monte Castelo, com muita satisfação, só tenho a agradecer aos profissionais que prestam um trabalho com excelência! Professores realmente comprometido com os alunos e uma equipe de gestão top!',
          name: 'João Carlos de Oliveira',
          role: 'Aluno',
          imageUrl: 'https://academiamontecastelo.com.br/wp-content/uploads/2019/11/depoimeto-01-1.jpeg',
          order: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          text: 'Hoje é um dia muito especial pra mim, pois alcancei o meu objetivo: A formação de vigilante na escola Monte Castelo. Estou  muito contente com as lições aprendidas e com os ótimos professores que a escola tem. A disciplina nos ensinamentos e o comprometimento de todos são pontos fortes da escola. Os outros colaboradores que atuam na administração também estão de parabéns pela eficiência e atenção que dão aos alunos. Sei que hoje, com os conhecimentos adquiridos, estou apta a desenvolver um bom trabalho na área de segurança. Fica aqui o meu muito obrigado a todos da equipe Monte Castelo pelos valores agregados na minha vida profissional e pessoal também.',
          name: 'Luciana Ribeiro de Oliveira Santos',
          role: 'Aluna',
          imageUrl: 'https://academiamontecastelo.com.br/wp-content/uploads/2019/11/depoimeto-02.jpeg',
          order: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      // Inserir os depoimentos padrão no banco
      const result = await db.collection('depoimentos-escritos').insertMany(depoimentosPadrao);
      
      // Buscar novamente para retornar com os _id gerados
      const depoimentosInseridos = await db
        .collection('depoimentos-escritos')
        .find({})
        .sort({ order: 1, createdAt: -1 })
        .toArray();

      return NextResponse.json(depoimentosInseridos);
    }

    return NextResponse.json(depoimentos);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao buscar depoimentos escritos:', error);
    return NextResponse.json({ error: 'Erro ao buscar depoimentos escritos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const db = await connectToDatabase();
    const body: DepoimentoEscrito = await request.json();

    // Validar campos obrigatórios
    if (!body.text || !body.name || !body.role || !body.imageUrl) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 });
    }

    // Buscar o maior order para definir o próximo
    const lastDepoimento = await db
      .collection('depoimentos-escritos')
      .findOne({}, { sort: { order: -1 } });

    const newOrder = lastDepoimento ? (lastDepoimento.order || 0) + 1 : 0;

    const depoimento = {
      text: body.text,
      name: body.name,
      role: body.role,
      imageUrl: body.imageUrl,
      order: newOrder,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await db.collection('depoimentos-escritos').insertOne(depoimento);

    return NextResponse.json({ _id: result.insertedId, ...depoimento });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    console.error('Erro ao criar depoimento escrito:', error);
    return NextResponse.json({ error: 'Erro ao criar depoimento escrito' }, { status: 500 });
  }
}
