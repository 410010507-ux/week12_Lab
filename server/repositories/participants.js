import { ObjectId } from 'mongodb';
import { getCollection } from '../db.js';

const col = () => getCollection('participants');

export async function createParticipant(data) {
  const doc = { ...data, createdAt: new Date(), updatedAt: new Date() };
  const result = await col().insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export function findAll() {
  return col().find().sort({ createdAt: -1 }).toArray();
}

export function findByOwner(ownerId) {
  return col().find({ ownerId }).sort({ createdAt: -1 }).toArray();
}

export function findById(id) {
  return col().findOne({ _id: new ObjectId(id) });
}

export function deleteById(id) {
  return col().deleteOne({ _id: new ObjectId(id) });
}
