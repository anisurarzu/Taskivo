import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { db } from '../lib/db.js';
import { createId, publicUser, signTokens } from '../lib/auth.js';
import { requireAuth, type AuthedRequest } from '../middleware/auth.js';

const DEMO_OTP = process.env.DEMO_OTP ?? '123456';

export const authRouter = Router();

function saveOtp(email: string, purpose: string) {
  const expiresAt = Date.now() + 1000 * 60 * 15;
  db.prepare(
    `INSERT INTO otps (email, purpose, code, expires_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(email, purpose) DO UPDATE SET code = excluded.code, expires_at = excluded.expires_at`,
  ).run(email.toLowerCase(), purpose, DEMO_OTP, expiresAt);
  return DEMO_OTP;
}

function readOtp(email: string, purpose: string, code: string) {
  const row = db
    .prepare(`SELECT code, expires_at FROM otps WHERE email = ? AND purpose = ?`)
    .get(email.toLowerCase(), purpose) as { code: string; expires_at: number } | undefined;
  if (!row || row.code !== code || row.expires_at < Date.now()) {
    throw new Error('Invalid or expired code');
  }
}

function consumeOtp(email: string, purpose: string, code: string) {
  readOtp(email, purpose, code);
  db.prepare(`DELETE FROM otps WHERE email = ? AND purpose = ?`).run(email.toLowerCase(), purpose);
}

authRouter.post('/register', async (req, res) => {
  const schema = z.object({
    name: z.string().trim().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid registration payload' });
  }
  const { name, email, password, confirmPassword } = parsed.data;
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  const existing = db
    .prepare(`SELECT id FROM users WHERE email = ?`)
    .get(email.toLowerCase());
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const now = new Date().toISOString();
  const id = createId('user');
  const passwordHash = await bcrypt.hash(password, 10);
  db.prepare(
    `INSERT INTO users (id, name, email, password_hash, email_verified, created_at, updated_at)
     VALUES (?, ?, ?, ?, 0, ?, ?)`,
  ).run(id, name, email.toLowerCase(), passwordHash, now, now);

  saveOtp(email, 'register');

  return res.status(201).json({
    user: {
      id,
      name,
      email: email.toLowerCase(),
      emailVerified: false,
    },
    requiresVerification: true,
    otpHint: DEMO_OTP,
  });
});

authRouter.post('/login', async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
    rememberMe: z.boolean().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const row = db
    .prepare(`SELECT * FROM users WHERE email = ?`)
    .get(parsed.data.email.toLowerCase()) as
    | {
        id: string;
        name: string;
        email: string;
        password_hash: string;
        email_verified: number;
        avatar_url: string | null;
      }
    | undefined;

  if (!row) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const ok = await bcrypt.compare(parsed.data.password, row.password_hash);
  if (!ok) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  if (!row.email_verified) {
    saveOtp(row.email, 'register');
    return res.status(403).json({
      message: 'Email not verified',
      requiresVerification: true,
      email: row.email,
    });
  }

  const tokens = signTokens(row);
  return res.json({
    user: publicUser(row),
    tokens,
    rememberMe: Boolean(parsed.data.rememberMe),
  });
});

authRouter.post('/forgot-password', (req, res) => {
  const email = String(req.body?.email ?? '').toLowerCase();
  if (!email) return res.status(400).json({ message: 'Email is required' });
  const user = db.prepare(`SELECT id FROM users WHERE email = ?`).get(email);
  if (user) saveOtp(email, 'reset');
  return res.json({
    success: true,
    email,
    message: 'If the account exists, a code was sent',
    otpHint: DEMO_OTP,
  });
});

authRouter.post('/verify-otp', async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    otp: z.string().min(4),
    purpose: z.enum(['register', 'reset']).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid OTP payload' });
  }

  const email = parsed.data.email.toLowerCase();
  const purpose =
    parsed.data.purpose ??
    (db.prepare(`SELECT purpose FROM otps WHERE email = ? ORDER BY expires_at DESC`).get(email) as
      | { purpose: string }
      | undefined)?.purpose ??
    'register';

  try {
    if (purpose === 'register') {
      consumeOtp(email, purpose, parsed.data.otp);
    } else {
      // Keep OTP until password reset completes.
      readOtp(email, purpose, parsed.data.otp);
    }
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : 'Invalid code',
    });
  }

  if (purpose === 'register') {
    const now = new Date().toISOString();
    db.prepare(`UPDATE users SET email_verified = 1, updated_at = ? WHERE email = ?`).run(
      now,
      email,
    );
    const row = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email) as {
      id: string;
      name: string;
      email: string;
      email_verified: number;
      avatar_url: string | null;
    };
    const tokens = signTokens(row);
    return res.json({
      success: true,
      email,
      session: {
        user: publicUser(row),
        tokens,
        rememberMe: true,
      },
    });
  }

  return res.json({ success: true, email });
});

authRouter.post('/reset-password', async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    otp: z.string().min(4),
    password: z.string().min(8),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid reset payload' });
  }

  const email = parsed.data.email.toLowerCase();
  try {
    consumeOtp(email, 'reset', parsed.data.otp);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : 'Invalid or expired code',
    });
  }

  const row = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email) as
    | {
        id: string;
        name: string;
        email: string;
        email_verified: number;
        avatar_url: string | null;
      }
    | undefined;
  if (!row) return res.status(404).json({ message: 'User not found' });

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const now = new Date().toISOString();
  db.prepare(
    `UPDATE users SET password_hash = ?, email_verified = 1, updated_at = ? WHERE email = ?`,
  ).run(passwordHash, now, email);

  const tokens = signTokens(row);
  return res.json({
    user: publicUser({ ...row, email_verified: 1 }),
    tokens,
    rememberMe: true,
  });
});

authRouter.get('/me', requireAuth, (req: AuthedRequest, res) => {
  const row = db.prepare(`SELECT * FROM users WHERE id = ?`).get(req.userId!) as
    | {
        id: string;
        name: string;
        email: string;
        email_verified: number;
        avatar_url: string | null;
      }
    | undefined;
  if (!row) return res.status(404).json({ message: 'User not found' });
  return res.json(publicUser(row));
});

authRouter.post('/logout', requireAuth, (_req, res) => {
  return res.json({ success: true });
});
