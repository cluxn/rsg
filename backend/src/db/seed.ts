import bcrypt from 'bcrypt';
import { pool } from './connection';

async function seed() {
  const email = process.env.ADMIN_EMAIL || 'admin@rsgprofilesheets.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@RSG2024';
  const hash = await bcrypt.hash(password, 12);

  await pool.query(
    'INSERT IGNORE INTO admin_users (email, password_hash, name) VALUES (?, ?, ?)',
    [email, hash, 'Admin']
  );

  await pool.query(`
    INSERT IGNORE INTO settings (\`key\`, value) VALUES
    ('whatsapp_number', ''),
    ('business_email', 'shivam.gupta09@gmail.com'),
    ('seo_scripts', ''),
    ('business_address', '53-A, Industrial Estate, Dada Nagar, Kanpur, Uttar Pradesh 208022, India'),
    ('business_hours', 'Mon–Sat 10 AM – 6 PM, Closed Sunday'),
    ('business_phone', '+91-8047307838')
  `);

  const products = [
    ['colour-coated-roofing-sheet', 'Colour Coated Roofing Sheet', 1],
    ['ms-plate-channel-angle', 'MS Plate, Channel & Angle', 2],
    ['ms-pipe', 'MS Pipe', 3],
    ['decking-sheet', 'Decking Sheet', 4],
    ['purlins', 'Purlins', 5],
    ['polycarbonate-sheet', 'Polycarbonate Sheet', 6],
    ['crimping-sheet', 'Crimping Sheet', 7],
    ['self-drilling-screws', 'Self Drilling Screws', 8],
    ['turbo-air-ventilator', 'Turbo Air Ventilator', 9],
    ['accessories', 'Accessories', 10],
  ];

  for (const [slug, name, order] of products) {
    await pool.query(
      'INSERT IGNORE INTO products (slug, name, display_order) VALUES (?, ?, ?)',
      [slug, name, order]
    );
  }

  console.log('Seed complete');
  await pool.end();
}

seed().catch(err => { console.error(err); process.exit(1); });
