import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { createParticipant, findAll, findByOwner, findById, deleteById } from '../repositories/participants.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  const data = req.user.role === 'admin'
    ? await findAll()
    : await findByOwner(req.user.id);

  res.json({ total: data.length, items: data });
});

router.post('/', async (req, res) => {
  const { name, email, phone } = req.body ?? {};
  if (!name || !email || !phone) return res.status(400).json({ error: '缺少必要欄位' });

  try {
    const doc = await createParticipant({ name, email, phone, ownerId: req.user.id });
    res.status(201).json({ id: doc._id.toString() });
  } catch (e) {
    // Mongo duplicate key
    if (e?.code === 11000) return res.status(409).json({ error: 'Email 已存在' });
    throw e;
  }
});

router.delete('/:id', async (req, res) => {
  const target = await findById(req.params.id);
  if (!target) return res.status(404).json({ error: '找不到資料' });

  const isOwner = target.ownerId === req.user.id;
  const isAdmin = req.user.role === 'admin';
  if (!isOwner && !isAdmin) return res.status(403).json({ error: '權限不足' });

  const result = await deleteById(req.params.id);
  if (!result.deletedCount) return res.status(404).json({ error: '找不到資料' });
  res.json({ message: '刪除完成' });
});

export default router;
