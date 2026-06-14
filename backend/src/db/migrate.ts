import fs from 'fs';
import path from 'path';
import { pool } from './connection';

async function migrate() {
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    const statements = sql.split(';').map(s => s.trim()).filter(Boolean);
    for (const stmt of statements) {
      await pool.query(stmt);
    }
    console.log(`Applied ${file}`);
  }
  console.log('Migration complete');
  await pool.end();
}

migrate().catch(err => { console.error(err); process.exit(1); });
