/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { Db } from 'mongodb';
import connectToDatabase from '../../utils/dbConnect';

export async function GET(_: NextRequest, context: any) {
  try {
    const db: Db = await connectToDatabase();

    const { slug } = await context.params;

    const post = await db.collection('posts').findOne({ slug });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
