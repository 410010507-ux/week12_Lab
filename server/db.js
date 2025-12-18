import { MongoClient } from 'mongodb';

let client;
let db;

export async function connectDB(uri = process.env.MONGODB_URI) {
  if (db) return db;
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(); // URI 已指定 DB
  console.log('[DB] Connected');
  return db;
}

export function getDB() {
  if (!db) throw new Error('Database not initialized');
  return db;
}

export function getCollection(name) {
  return getDB().collection(name);
}

export async function closeDB() {
  if (client) await client.close();
  db = null;
}
