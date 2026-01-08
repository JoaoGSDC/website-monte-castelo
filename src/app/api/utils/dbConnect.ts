import { MongoClient, Db } from 'mongodb';

let cachedDb: Db;

async function connectToDatabase(): Promise<Db> {
  try {
    if (cachedDb) {
      return cachedDb;
    }

    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    if (!process.env.MONGODB_DB) {
      throw new Error('MONGODB_DB environment variable is not set');
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI);

    const db = client.db(process.env.MONGODB_DB);
    cachedDb = db;

    console.log('MongoDB Connect Status: Success!');

    return db;
  } catch (error: any) {
    console.error('MongoDB Connection Error:', error);
    throw error; // Lançar erro ao invés de retornar
  }
}

export default connectToDatabase;
