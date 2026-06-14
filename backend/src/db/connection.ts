import mysql, { type PoolOptions } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const poolConfig: PoolOptions = {
  host:            process.env.DB_HOST,
  port:            Number(process.env.DB_PORT) || 3306,
  user:            process.env.DB_USER,
  password:        process.env.DB_PASSWORD,
  database:        process.env.DB_NAME,
  connectionLimit: 5,
  waitForConnections: true,
};

export const pool = mysql.createPool(poolConfig);

export async function query<T = unknown>(sql: string, params?: (string | number | boolean | null)[]): Promise<T[]> {
  const [rows] = await pool.execute(sql, params);
  return rows as T[];
}
