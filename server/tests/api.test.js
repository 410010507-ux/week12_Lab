import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcrypt';
import { MongoClient } from 'mongodb';

let mongod;
let client;
let db;
let app;

async function seedAdmin() {
  const passwordHash = await bcrypt.hash('AdminPass123', 10);
  await db.collection('users').insertOne({
    email: 'admin@example.com',
    passwordHash,
    role: 'admin',
    createdAt: new Date()
  });
}

async function signupAndLogin(email, password) {
  // signup
  await request(app).post('/auth/signup').send({ email, password });
  // login
  const res = await request(app).post('/auth/login').send({ email, password });
  expect(res.status).toBe(200);
  expect(res.body.token).toBeTruthy();
  return res.body.token;
}

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri('week12_test');
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

  await connectDB(process.env.MONGODB_URI); 
}, 30000); 

afterAll(async () => {
  await closeDB();
  if (mongo) await mongo.stop();
});

beforeEach(async () => {
  
  await db.collection('users').deleteMany({});
  await db.collection('participants').deleteMany({});

  
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('participants').createIndex({ email: 1 }, { unique: true });

  await seedAdmin();
});

describe('Week12 auth + signup api', () => {
  it('未登入 GET /api/signup 應該 401', async () => {
    const res = await request(app).get('/api/signup');
    expect(res.status).toBe(401);
  });

  it('未登入被拒 → 登入成功 → 權限不足 → admin 刪除成功', async () => {
    const tokenA = await signupAndLogin('a@example.com', 'Pass1234');
    const tokenB = await signupAndLogin('b@example.com', 'Pass1234');

    // A 建立一筆報名
    const createRes = await request(app)
      .post('/api/signup')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ name: 'A同學', email: 'a1@example.com', phone: '0912345678' });

    expect(createRes.status).toBe(201);
    const id = createRes.body.id;
    expect(id).toBeTruthy();

    // B 想刪 A 的資料 -> 403
    const delByB = await request(app)
      .delete(`/api/signup/${id}`)
      .set('Authorization', `Bearer ${tokenB}`);
    expect(delByB.status).toBe(403);

    // admin 登入 -> 刪除成功
    const adminLogin = await request(app).post('/auth/login').send({
      email: 'admin@example.com',
      password: 'AdminPass123'
    });
    expect(adminLogin.status).toBe(200);
    const adminToken = adminLogin.body.token;

    const delByAdmin = await request(app)
      .delete(`/api/signup/${id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(delByAdmin.status).toBe(200);
  });
});