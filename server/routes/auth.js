import express from 'express';
import bcrypt from 'bcrypt';
import { findUserByEmail, createUser } from '../repositories/users.js';
import { generateToken, tokenExpiresIn } from '../utils/generateToken.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: '缺少 email 或 password' });

  const exists = await findUserByEmail(email);
  if (exists) return res.status(409).json({ error: 'Email 已被註冊' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser({ email, passwordHash, role: 'student' }); // 這裡固定 student
  res.status(201).json({ id: user._id, email: user.email, role: user.role });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: '缺少 email 或 password' });

  const user = await findUserByEmail(email);
  if (!user) return res.status(401).json({ error: '帳號或密碼錯誤' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: '帳號或密碼錯誤' });

  const token = generateToken(user);
  res.json({
    token,
    expiresIn: tokenExpiresIn,
    user: { id: user._id.toString(), email: user.email, role: user.role }
  });
});

export default router;
