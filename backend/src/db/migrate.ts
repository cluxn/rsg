import fs from 'fs';
import path from 'path';
import { pool } from './connection';

async function migrate() {
  const sql = fs.readFileSync(
    path.join(__dirname, 'migrations', '001_initial_schema.sql'),
    'utf8'
  );
  const statements = sql.split(';').map(s => s.trim()).filter(Boolean);
  for (const stmt of statements) {
    await pool.query(stmt);
  }
  console.log('Migration complete');
  await pool.end();
}

migrate().catch(err => { console.error(err); process.exit(1); });
