import { NextResponse } from 'next/server';
import connectToDatabase from '../utils/dbConnect';
import { Db } from 'mongodb';

export async function GET() {
  try {
    const db: Db = await connectToDatabase();

    const courses = await db.collection('courses').find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
