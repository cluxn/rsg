import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { pool } from './db/connection';
import healthRouter from './routes/health';
import authRouter from './routes/auth';
import settingsRouter from './routes/settings';
import revalidateRouter from './routes/revalidate';
import leadsRouter from './routes/leads';
import { productsRouter } from './routes/products';
import { mediaRouter } from './routes/media';
import blogRouter from './routes/blog';
import eventsRouter from './routes/events';
import testimonialsRouter from './routes/testimonials';
import caseStudiesRouter from './routes/case_studies';
import clientLogosRouter from './routes/client_logos';
import authorsRouter from './routes/authors';
import categoriesRouter from './routes/categories';
import dashboardRouter from './routes/dashboard';

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
app.use('/api/leads', leadsRouter);
app.use('/api/products', productsRouter);
app.use('/api/media', mediaRouter);
app.use('/api/blog', blogRouter);
app.use('/api/events', eventsRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/case-studies', caseStudiesRouter);
app.use('/api/client-logos', clientLogosRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/dashboard', dashboardRouter);

pool.query('SELECT 1')
  .then(() => console.log('DB connected'))
  .catch((err) => console.error('DB connection failed:', err));

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));

export default app;
