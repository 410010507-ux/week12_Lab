// server/routes/signup.js
import express from 'express';
import {
  createParticipant,
  listParticipants,
  updateParticipant,
  deleteParticipant
} from '../repositories/participants.js';

const router = express.Router();

// POST /api/signup：建立報名並回傳 _id
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ error: '缺少必要欄位' });
    }

    try {
      const id = await createParticipant({ name, email, phone });
      res.status(201).json({ _id: id });
    } catch (err) {
      // ★ 重複 email：Mongo 會丟 11000 duplicate key
      if (err.code === 11000) {
        return res.status(409).json({
          error: '此 email 已完成報名，請勿重複送出。'
        });
      }
      throw err;
    }
  } catch (error) {
    next(error);
  }
});

// GET /api/signup?page=1&limit=10：清單 + total + 分頁
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await listParticipants(page, limit);
    res.json(result); // { items, total, page, limit }
  } catch (error) {
    next(error);
  }
});

// PATCH /api/signup/:id：可更新 phone 或 status
router.patch('/:id', async (req, res, next) => {
  try {
    const { phone, status } = req.body;
    if (!phone && !status) {
      return res.status(400).json({
        error: '至少需要提供 phone 或 status 其中一個欄位'
      });
    }

    const result = await updateParticipant(req.params.id, { phone, status });
    if (!result.matchedCount) {
      return res.status(404).json({ error: '找不到資料' });
    }
    res.json({ updated: result.modifiedCount });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/signup/:id：刪除特定報名
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await deleteParticipant(req.params.id);
    if (!result.deletedCount) {
      return res.status(404).json({ error: '找不到資料' });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
