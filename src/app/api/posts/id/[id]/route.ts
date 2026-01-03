import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../utils/dbConnect';
import { ObjectId } from 'mongodb';

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const db = await connectToDatabase();
    const { id } = await context.params;

    const post = await db.collection('posts').findOne({ _id: new ObjectId(id) });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post by id:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

