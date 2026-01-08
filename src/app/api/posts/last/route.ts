import { NextResponse } from 'next/server';
import connectToDatabase from '../../utils/dbConnect';
import { Db } from 'mongodb';

export async function GET() {
  try {
    const db: Db = await connectToDatabase();

    const posts = await db.collection('posts').find({}).sort({ createdAt: -1 }).limit(3).toArray();

    return NextResponse.json(posts, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600', // Cache por 30 minutos
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
