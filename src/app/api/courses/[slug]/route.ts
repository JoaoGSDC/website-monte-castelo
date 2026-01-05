import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../utils/dbConnect';
import { Db } from 'mongodb';

export async function GET(_: NextRequest, context: any) {
  try {
    const { slug } = await context.params;
    const db: Db = await connectToDatabase();

    const course = await db.collection('courses').findOne({ slug });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching course by slug:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
