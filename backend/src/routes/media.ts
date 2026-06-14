import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { pool } from '../db/connection';
import { requireAuth } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();
const UPLOADS_DIR = path.join(__dirname, '../../uploads');

function thumbnailUrl(url: string): string {
  return url.replace('.webp', '_thumb.webp');
}

router.post('/upload', requireAuth, upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  const altText = (req.body?.alt_text as string | undefined)?.trim();
  if (!altText) { res.status(400).json({ error: 'alt_text is required' }); return; }
  if (!req.file) { res.status(400).json({ error: 'file is required' }); return; }

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const fileUrl = `/uploads/${filename}.webp`;
  const thumbUrl = `/uploads/${filename}_thumb.webp`;

  await sharp(req.file.buffer).webp().toFile(path.join(UPLOADS_DIR, `${filename}.webp`));
  await sharp(req.file.buffer)
    .resize(400, 400, { fit: 'cover' })
    .webp()
    .toFile(path.join(UPLOADS_DIR, `${filename}_thumb.webp`));

  const [result] = await pool.query(
    'INSERT INTO media (filename, original_name, alt_text, mime_type, size, url) VALUES (?, ?, ?, ?, ?, ?)',
    [filename, req.file.originalname, altText, req.file.mimetype, req.file.size, fileUrl]
  ) as [{ insertId: number }, unknown];

  res.status(201).json({
    id: result.insertId,
    url: fileUrl,
    thumbnail_url: thumbUrl,
    alt_text: altText,
    original_name: req.file.originalname,
  });
});

router.get('/', requireAuth, async (_req: Request, res: Response): Promise<void> => {
  const [rows] = await pool.query(
    'SELECT id, filename, original_name, alt_text, url, uploaded_at FROM media ORDER BY uploaded_at DESC'
  ) as [{ id: number; filename: string; original_name: string; alt_text: string; url: string; uploaded_at: Date }[], unknown];

  res.json(rows.map(row => ({ ...row, thumbnail_url: thumbnailUrl(row.url) })));
});

router.put('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const altText = (req.body?.alt_text as string | undefined)?.trim();
  if (!altText) { res.status(400).json({ error: 'alt_text is required' }); return; }

  await pool.query('UPDATE media SET alt_text = ? WHERE id = ?', [altText, req.params.id]);

  const [rows] = await pool.query(
    'SELECT id, filename, original_name, alt_text, url, uploaded_at FROM media WHERE id = ?',
    [req.params.id]
  ) as [{ id: number; filename: string; original_name: string; alt_text: string; url: string; uploaded_at: Date }[], unknown];

  if (rows.length === 0) { res.status(404).json({ error: 'Not found' }); return; }
  res.json({ ...rows[0], thumbnail_url: thumbnailUrl(rows[0].url) });
});

router.get('/:id/usage', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const [rows] = await pool.query(
    `SELECT products.slug, products.name FROM product_media
     JOIN products ON products.id = product_media.product_id
     WHERE product_media.media_id = ?`,
    [req.params.id]
  ) as [{ slug: string; name: string }[], unknown];

  res.json({ used: rows.length > 0, products: rows });
});

router.delete('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const [linked] = await pool.query(
    `SELECT products.slug, products.name FROM product_media
     JOIN products ON products.id = product_media.product_id
     WHERE product_media.media_id = ?`,
    [req.params.id]
  ) as [{ slug: string; name: string }[], unknown];

  if (linked.length > 0) {
    res.status(409).json({ error: 'Image is in use', linkedProducts: linked });
    return;
  }

  const [rows] = await pool.query(
    'SELECT filename FROM media WHERE id = ?',
    [req.params.id]
  ) as [{ filename: string }[], unknown];

  if (rows.length === 0) { res.status(404).json({ error: 'Not found' }); return; }

  await pool.query('DELETE FROM media WHERE id = ?', [req.params.id]);

  const { filename } = rows[0];
  for (const suffix of ['.webp', '_thumb.webp']) {
    const filePath = path.join(UPLOADS_DIR, `${filename}${suffix}`);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  res.json({ deleted: true });
});

export { router as mediaRouter };
export default router;
