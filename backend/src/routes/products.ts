import { Router, Request, Response } from 'express';
import { pool } from '../db/connection';
import { requireAuth } from '../middleware/auth';

const router = Router();

type ProductRow = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  specs: { label: string; value: string }[] | null;
};

type MediaRow = { id: number; url: string; alt_text: string; display_order: number };

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const [rows] = await pool.query(
    'SELECT id, slug, name, display_order FROM products ORDER BY display_order ASC'
  );
  res.json(rows);
});

router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  const [products] = await pool.query(
    'SELECT id, slug, name, description, specs FROM products WHERE slug = ?',
    [req.params.slug]
  ) as [ProductRow[], unknown];

  if (products.length === 0) { res.status(404).json({ error: 'Not found' }); return; }
  const product = products[0];

  const [media] = await pool.query(
    `SELECT media.id, media.url, media.alt_text, product_media.display_order
     FROM product_media
     JOIN media ON media.id = product_media.media_id
     WHERE product_media.product_id = ?
     ORDER BY product_media.display_order ASC`,
    [product.id]
  ) as [MediaRow[], unknown];

  res.json({ ...product, media });
});

router.put('/:slug', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const { description, specs, media_ids } = req.body as {
    description: string;
    specs: { label: string; value: string }[];
    media_ids: number[];
  };

  const [products] = await pool.query(
    'SELECT id FROM products WHERE slug = ?',
    [req.params.slug]
  ) as [{ id: number }[], unknown];

  if (products.length === 0) { res.status(404).json({ error: 'Not found' }); return; }
  const productId = products[0].id;

  await pool.query(
    'UPDATE products SET description = ?, specs = ? WHERE id = ?',
    [description, JSON.stringify(specs ?? []), productId]
  );

  await pool.query('DELETE FROM product_media WHERE product_id = ?', [productId]);
  if (media_ids && media_ids.length > 0) {
    const values = media_ids.map((mediaId, i) => [productId, mediaId, i]);
    await pool.query(
      `INSERT INTO product_media (product_id, media_id, display_order) VALUES ${values.map(() => '(?, ?, ?)').join(', ')}`,
      values.flat()
    );
  }

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  fetch(`${frontendUrl}/api/revalidate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: process.env.REVALIDATE_SECRET, path: `/products/${req.params.slug}` }),
  }).catch(() => {});

  const [updated] = await pool.query(
    'SELECT id, slug, name, description, specs FROM products WHERE id = ?',
    [productId]
  ) as [ProductRow[], unknown];

  const [media] = await pool.query(
    `SELECT media.id, media.url, media.alt_text, product_media.display_order
     FROM product_media
     JOIN media ON media.id = product_media.media_id
     WHERE product_media.product_id = ?
     ORDER BY product_media.display_order ASC`,
    [productId]
  ) as [MediaRow[], unknown];

  res.json({ ...updated[0], media });
});

router.get('/:slug/media', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const [media] = await pool.query(
    `SELECT media.* FROM product_media
     JOIN media ON media.id = product_media.media_id
     WHERE product_media.product_id = (SELECT id FROM products WHERE slug = ?)
     ORDER BY product_media.display_order ASC`,
    [req.params.slug]
  );
  res.json(media);
});

export { router as productsRouter };
export default router;
