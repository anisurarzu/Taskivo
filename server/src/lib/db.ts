import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import Database from 'better-sqlite3';

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    email_verified INTEGER NOT NULL DEFAULT 0,
    avatar_url TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS otps (
    email TEXT NOT NULL,
    purpose TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at BIGINT NOT NULL,
    PRIMARY KEY (email, purpose)
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT NOT NULL,
    status TEXT NOT NULL,
    category TEXT NOT NULL,
    tags_json TEXT NOT NULL DEFAULT '[]',
    subtasks_json TEXT NOT NULL DEFAULT '[]',
    due_at TEXT,
    reminder_at TEXT,
    completed_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    is_completed INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS focus_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id TEXT,
    task_title TEXT,
    duration_seconds INTEGER NOT NULL,
    completed_seconds INTEGER NOT NULL,
    started_at TEXT NOT NULL,
    ended_at TEXT NOT NULL,
    status TEXT NOT NULL
  );
`;

export const usePostgres = Boolean(process.env.DATABASE_URL);

let sqlite: Database.Database | null = null;
let pool: pg.Pool | null = null;

function toPgParams(sql: string) {
  let index = 0;
  return sql.replace(/\?/g, () => `$${++index}`);
}

export async function initDb() {
  if (usePostgres) {
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
    });
    await pool.query(SCHEMA);
    console.log('Database: Postgres');
    return;
  }

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const dataDir = path.resolve(__dirname, '../../data');
  fs.mkdirSync(dataDir, { recursive: true });
  const dbPath = process.env.DATABASE_PATH ?? path.join(dataDir, 'taskivo.db');
  sqlite = new Database(dbPath);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  sqlite.exec(SCHEMA.replace(/BIGINT/g, 'INTEGER'));
  console.log(`Database: SQLite (${dbPath})`);
}

export async function queryAll<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  if (usePostgres) {
    if (!pool) throw new Error('Postgres pool not initialized');
    const result = await pool.query(toPgParams(sql), params);
    return result.rows as T[];
  }
  if (!sqlite) throw new Error('SQLite not initialized');
  return sqlite.prepare(sql).all(...params) as T[];
}

export async function queryOne<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
): Promise<T | undefined> {
  const rows = await queryAll<T>(sql, params);
  return rows[0];
}

export async function execute(
  sql: string,
  params: unknown[] = [],
): Promise<{ changes: number }> {
  if (usePostgres) {
    if (!pool) throw new Error('Postgres pool not initialized');
    const result = await pool.query(toPgParams(sql), params);
    return { changes: result.rowCount ?? 0 };
  }
  if (!sqlite) throw new Error('SQLite not initialized');
  const result = sqlite.prepare(sql).run(...params);
  return { changes: result.changes };
}

export function getDbDriver() {
  return usePostgres ? 'postgres' : 'sqlite';
}
