import bcrypt from 'bcryptjs';
import { queryOne, execute } from './db.js';
import { createId } from './auth.js';

const DEMO_EMAIL = 'demo@taskivo.app';
const DEMO_PASSWORD = 'Taskivo123';

/** Ensure a stable demo account exists (works for Postgres + SQLite). */
export async function seedDemoUser() {
  const existing = await queryOne<{ id: string }>(`SELECT id FROM users WHERE email = ?`, [
    DEMO_EMAIL,
  ]);
  if (existing) return;

  const now = new Date().toISOString();
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  await execute(
    `INSERT INTO users (id, name, email, password_hash, email_verified, created_at, updated_at)
     VALUES (?, ?, ?, ?, 1, ?, ?)`,
    [createId('user'), 'Demo User', DEMO_EMAIL, passwordHash, now, now],
  );

  console.log(`Seeded demo user: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
}
