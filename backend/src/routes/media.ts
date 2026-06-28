import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { pool } from '../db/connection';
import { requireAuth } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();
const UPLOADS_DIR = path.join(__dirname, '../../uploads');
const FRONTEND_PUBLIC = path.join(__dirname, '../../../frontend/public');
const STATIC_IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']);

function thumbnailUrl(url: string): string {
  return url.replace('.webp', '_thumb.webp');
}

function walkImages(dir: string, base: string, results: string[] = []): string[] {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkImages(full, base, results);
    } else if (STATIC_IMAGE_EXTS.has(path.extname(entry.name).toLowerCase())) {
      results.push('/' + path.relative(base, full).replace(/\\/g, '/'));
    }
  }
  return results;
}

router.post('/upload', requireAuth, upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  if (!req.file) { res.status(400).json({ error: 'file is required' }); return; }
  const rawAlt = (req.body?.alt_text as string | undefined)?.trim();
  const altText = rawAlt || req.file.originalname.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');

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
  const originalName = (req.body?.original_name as string | undefined)?.trim();
  if (!altText && !originalName) { res.status(400).json({ error: 'alt_text or original_name is required' }); return; }

  const fields: string[] = [];
  const params: (string | number)[] = [];
  if (altText) { fields.push('alt_text = ?'); params.push(altText); }
  if (originalName) { fields.push('original_name = ?'); params.push(originalName); }
  params.push(Number(req.params.id));

  await pool.query(`UPDATE media SET ${fields.join(', ')} WHERE id = ?`, params);

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

router.post('/bulk-delete', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const { ids } = req.body as { ids: number[] };
  if (!Array.isArray(ids) || ids.length === 0) { res.status(400).json({ error: 'ids required' }); return; }

  const placeholders = ids.map(() => '?').join(', ');
  const [rows] = await pool.query(
    `SELECT id, filename FROM media WHERE id IN (${placeholders})`,
    ids
  ) as [{ id: number; filename: string }[], unknown];

  // Only delete items not linked to products
  const [linked] = await pool.query(
    `SELECT DISTINCT media_id FROM product_media WHERE media_id IN (${placeholders})`,
    ids
  ) as [{ media_id: number }[], unknown];
  const linkedIds = new Set(linked.map(r => r.media_id));

  const toDelete = rows.filter(r => !linkedIds.has(r.id));
  if (toDelete.length === 0) { res.status(409).json({ error: 'All selected images are in use by products' }); return; }

  const deleteIds = toDelete.map(r => r.id);
  const deletePlaceholders = deleteIds.map(() => '?').join(', ');
  await pool.query(`DELETE FROM media WHERE id IN (${deletePlaceholders})`, deleteIds);

  for (const { filename } of toDelete) {
    for (const suffix of ['.webp', '_thumb.webp']) {
      const filePath = path.join(UPLOADS_DIR, `${filename}${suffix}`);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  }

  res.json({ deleted: toDelete.length, skipped: ids.length - toDelete.length });
});

router.post('/sync-static', requireAuth, async (_req: Request, res: Response): Promise<void> => {
  const imagePaths = walkImages(path.join(FRONTEND_PUBLIC, 'images'), FRONTEND_PUBLIC);

  const [existingRows] = await pool.query('SELECT url FROM media') as [{ url: string }[], unknown];
  const existingUrls = new Set(existingRows.map(r => r.url));

  let added = 0;
  for (const imgPath of imagePaths) {
    if (existingUrls.has(imgPath)) continue;
    const filename = path.basename(imgPath, path.extname(imgPath));
    const altText = filename.replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
    const originalName = path.basename(imgPath);
    const ext = path.extname(imgPath).toLowerCase();
    const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : ext === '.svg' ? 'image/svg+xml' : 'image/jpeg';
    await pool.query(
      'INSERT INTO media (filename, original_name, alt_text, mime_type, size, url) VALUES (?, ?, ?, ?, ?, ?)',
      [filename, originalName, altText, mime, 0, imgPath]
    );
    added++;
  }

  res.json({ added, total: imagePaths.length });
});

export { router as mediaRouter };
export default router;
