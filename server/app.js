import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import signupRouter from './routes/signup.js';

const app = express();

app.use(cors({ origin: process.env.ALLOWED_ORIGIN }));
app.use(express.json());

// API
app.use('/api/signup', signupRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// 統一錯誤處理
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server Error' });
});

const port = process.env.PORT || 3001;

// 先連線 DB 再啟動 server
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect MongoDB', error);
    process.exit(1);
  });
