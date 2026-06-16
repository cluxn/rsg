import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { pool } from './db/connection';
import healthRouter from './routes/health';
import authRouter from './routes/auth';
import settingsRouter from './routes/settings';
import revalidateRouter from './routes/revalidate';
import leadsRouter from './routes/leads';
import { productsRouter } from './routes/products';
import { mediaRouter } from './routes/media';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'], credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/revalidate', revalidateRouter);
const leadsRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many enquiries from this IP. Please try again later.' },
});

app.use('/api/leads', leadsRateLimit);
app.use('/api/leads', leadsRouter);
app.use('/api/products', productsRouter);
app.use('/api/media', mediaRouter);

pool.query('SELECT 1')
  .then(() => console.log('DB connected'))
  .catch((err) => console.error('DB connection failed:', err));

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));

export default app;
