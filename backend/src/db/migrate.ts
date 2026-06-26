import fs from 'fs';
import path from 'path';
import { pool } from './connection';

const IDEMPOTENT_ERRORS = new Set([
  'ER_DUP_FIELDNAME',     // ADD COLUMN already exists
  'ER_TABLE_EXISTS_ERROR', // CREATE TABLE already exists
  'ER_DUP_KEYNAME',       // duplicate index name
]);

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const [applied] = await pool.query('SELECT filename FROM schema_migrations') as [{ filename: string }[], unknown];
  const appliedSet = new Set((applied as { filename: string }[]).map(r => r.filename));

  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  for (const file of files) {
    if (appliedSet.has(file)) {
      console.log(`Skipped  ${file} (already applied)`);
      continue;
    }
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    const statements = sql.split(';').map(s => s.trim()).filter(Boolean);
    let alreadyApplied = false;
    for (const stmt of statements) {
      try {
        await pool.query(stmt);
      } catch (err: any) {
        if (IDEMPOTENT_ERRORS.has(err.code)) {
          alreadyApplied = true;
          console.log(`  Note: ${file} — idempotent skip (${err.code})`);
        } else {
          throw err;
        }
      }
    }
    await pool.query('INSERT INTO schema_migrations (filename) VALUES (?)', [file]);
    console.log(alreadyApplied ? `Marked   ${file} (was already applied)` : `Applied  ${file}`);
  }

  console.log('Migration complete');
  await pool.end();
}

migrate().catch(err => { console.error(err); process.exit(1); });
