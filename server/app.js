import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import authRouter from './routes/auth.js';
import signupRouter from './routes/signup.js';

const app = express();

app.use(cors({ origin: process.env.ALLOWED_ORIGIN }));
app.use(express.json());

app.use('/auth', authRouter);
app.use('/api/signup', signupRouter);

app.use((req, res) => res.status(404).json({ error: 'Not Found' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server Error' });
});

// 直接 node app.js 才 listen（讓 vitest 可以 import app）
if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3001;
  connectDB()
    .then(() => app.listen(port, () => console.log(`Server running on http://localhost:${port}`)))
    .catch((e) => { console.error('Failed to connect MongoDB', e); process.exit(1); });
}

export default app;

if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3001;
  connectDB()
    .then(() => {
      app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
    })
    .catch((err) => {
      console.error('Failed to connect MongoDB', err);
      process.exit(1);
    });
}
