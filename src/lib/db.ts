import { MongoClient, Db } from 'mongodb';

const uri ="mongodb+srv://<suday>:<uday123>@cluster0.x7arkho.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

let db: Db | null = null;

export async function connectDB(): Promise<Db> {
  if (!db) {
    await client.connect();
    db = client.db('cardDB'); // 👈 your DB name here
  }
  return db;
}
