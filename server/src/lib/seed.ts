import bcrypt from 'bcryptjs';
import { db } from './db.js';
import { createId } from './auth.js';

const DEMO_EMAIL = 'demo@taskivo.app';
const DEMO_PASSWORD = 'Taskivo123';

/** Ensure a stable demo account exists after SQLite resets on redeploy. */
export async function seedDemoUser() {
  const existing = db.prepare(`SELECT id FROM users WHERE email = ?`).get(DEMO_EMAIL);
  if (existing) return;

  const now = new Date().toISOString();
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  db.prepare(
    `INSERT INTO users (id, name, email, password_hash, email_verified, created_at, updated_at)
     VALUES (?, ?, ?, ?, 1, ?, ?)`,
  ).run(createId('user'), 'Demo User', DEMO_EMAIL, passwordHash, now, now);

  console.log(`Seeded demo user: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
}
