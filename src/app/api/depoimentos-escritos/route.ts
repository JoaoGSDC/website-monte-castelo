import { NextResponse } from 'next/server';
import connectToDatabase from '../utils/dbConnect';

export async function GET() {
  try {
    const db = await connectToDatabase();
    const depoimentos = await db
      .collection('depoimentos-escritos')
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    const cacheHeaders = {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    };

    // Se não houver depoimentos, retornar os padrão
    if (depoimentos.length === 0) {
      const depoimentosPadrao = [
        {
          _id: 'padrao-1',
          text: 'Formado recentemente no curso de vigilante na academia Monte Castelo, com muita satisfação, só tenho a agradecer aos profissionais que prestam um trabalho com excelência! Professores realmente comprometido com os alunos e uma equipe de gestão top!',
          name: 'João Carlos de Oliveira',
          role: 'Aluno',
          imageUrl: 'https://academiamontecastelo.com.br/wp-content/uploads/2019/11/depoimeto-01-1.jpeg',
        },
        {
          _id: 'padrao-2',
          text: 'Hoje é um dia muito especial pra mim, pois alcancei o meu objetivo: A formação de vigilante na escola Monte Castelo. Estou  muito contente com as lições aprendidas e com os ótimos professores que a escola tem. A disciplina nos ensinamentos e o comprometimento de todos são pontos fortes da escola. Os outros colaboradores que atuam na administração também estão de parabéns pela eficiência e atenção que dão aos alunos. Sei que hoje, com os conhecimentos adquiridos, estou apta a desenvolver um bom trabalho na área de segurança. Fica aqui o meu muito obrigado a todos da equipe Monte Castelo pelos valores agregados na minha vida profissional e pessoal também.',
          name: 'Luciana Ribeiro de Oliveira Santos',
          role: 'Aluna',
          imageUrl: 'https://academiamontecastelo.com.br/wp-content/uploads/2019/11/depoimeto-02.jpeg',
        },
      ];
      return NextResponse.json(depoimentosPadrao, { headers: cacheHeaders });
    }

    // Retornar apenas os campos necessários para o frontend
    return NextResponse.json(
      depoimentos.map((depoimento) => ({
        _id: depoimento._id.toString(),
        text: depoimento.text,
        name: depoimento.name,
        role: depoimento.role,
        imageUrl: depoimento.imageUrl,
      })),
      { headers: cacheHeaders }
    );
  } catch (error) {
    console.error('Erro ao buscar depoimentos escritos:', error);
    return NextResponse.json(
      {
        error: 'Erro ao buscar depoimentos escritos',
      },
      { status: 500 }
    );
  }
}
