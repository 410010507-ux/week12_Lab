// server/repositories/participants.js
import { ObjectId } from 'mongodb';
import { getDB } from '../db.js';

const collection = () => getDB().collection('participants');

// Create：建立報名
export async function createParticipant(data) {
  const now = new Date();
  const result = await collection().insertOne({
    ...data,
    status: data.status || 'pending', // 預設狀態
    createdAt: now,
    updatedAt: now
  });
  return result.insertedId;
}

// Read：分頁讀取清單 + total
export async function listParticipants(page = 1, limit = 10) {
  const p = Number(page) || 1;
  const l = Number(limit) || 10;
  const skip = (p - 1) * l;

  const coll = collection();

  const [items, total] = await Promise.all([
    coll
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l)
      .toArray(),
    coll.countDocuments()
  ]);

  return { items, total, page: p, limit: l };
}

// Update：更新 phone / status
export async function updateParticipant(id, patch) {
  const allowed = {};
  if (patch.phone) allowed.phone = patch.phone;
  if (patch.status) allowed.status = patch.status;

  if (Object.keys(allowed).length === 0) {
    return { matchedCount: 0, modifiedCount: 0 };
  }

  return collection().updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...allowed, updatedAt: new Date() } }
  );
}

// Delete：刪除報名
export function deleteParticipant(id) {
  return collection().deleteOne({ _id: new ObjectId(id) });
}
