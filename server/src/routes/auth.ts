import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { execute, queryOne } from '../lib/db.js';
import { createId, publicUser, signTokens } from '../lib/auth.js';
import { requireAuth, type AuthedRequest } from '../middleware/auth.js';

const DEMO_OTP = process.env.DEMO_OTP ?? '123456';

type UserRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  email_verified: number | boolean;
  avatar_url: string | null;
};

export const authRouter = Router();

async function saveOtp(email: string, purpose: string) {
  const expiresAt = Date.now() + 1000 * 60 * 15;
  await execute(
    `INSERT INTO otps (email, purpose, code, expires_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(email, purpose) DO UPDATE SET code = excluded.code, expires_at = excluded.expires_at`,
    [email.toLowerCase(), purpose, DEMO_OTP, expiresAt],
  );
  return DEMO_OTP;
}

async function readOtp(email: string, purpose: string, code: string) {
  const row = await queryOne<{ code: string; expires_at: number | string }>(
    `SELECT code, expires_at FROM otps WHERE email = ? AND purpose = ?`,
    [email.toLowerCase(), purpose],
  );
  const expiresAt = Number(row?.expires_at ?? 0);
  if (!row || row.code !== code || expiresAt < Date.now()) {
    throw new Error('Invalid or expired code');
  }
}

async function consumeOtp(email: string, purpose: string, code: string) {
  await readOtp(email, purpose, code);
  await execute(`DELETE FROM otps WHERE email = ? AND purpose = ?`, [
    email.toLowerCase(),
    purpose,
  ]);
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

  const existing = await queryOne(`SELECT id FROM users WHERE email = ?`, [email.toLowerCase()]);
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const now = new Date().toISOString();
  const id = createId('user');
  const passwordHash = await bcrypt.hash(password, 10);
  await execute(
    `INSERT INTO users (id, name, email, password_hash, email_verified, created_at, updated_at)
     VALUES (?, ?, ?, ?, 0, ?, ?)`,
    [id, name, email.toLowerCase(), passwordHash, now, now],
  );

  await saveOtp(email, 'register');

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

  const row = await queryOne<UserRow>(`SELECT * FROM users WHERE email = ?`, [
    parsed.data.email.toLowerCase(),
  ]);

  if (!row) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const ok = await bcrypt.compare(parsed.data.password, row.password_hash);
  if (!ok) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  if (!row.email_verified) {
    await saveOtp(row.email, 'register');
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

authRouter.post('/forgot-password', async (req, res) => {
  const email = String(req.body?.email ?? '').toLowerCase();
  if (!email) return res.status(400).json({ message: 'Email is required' });
  const user = await queryOne(`SELECT id FROM users WHERE email = ?`, [email]);
  if (user) await saveOtp(email, 'reset');
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
  const purposeRow = await queryOne<{ purpose: string }>(
    `SELECT purpose FROM otps WHERE email = ? ORDER BY expires_at DESC`,
    [email],
  );
  const purpose = parsed.data.purpose ?? purposeRow?.purpose ?? 'register';

  try {
    if (purpose === 'register') {
      await consumeOtp(email, purpose, parsed.data.otp);
    } else {
      await readOtp(email, purpose, parsed.data.otp);
    }
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : 'Invalid code',
    });
  }

  if (purpose === 'register') {
    const now = new Date().toISOString();
    await execute(`UPDATE users SET email_verified = 1, updated_at = ? WHERE email = ?`, [
      now,
      email,
    ]);
    const row = await queryOne<UserRow>(`SELECT * FROM users WHERE email = ?`, [email]);
    if (!row) return res.status(404).json({ message: 'User not found' });
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
    await consumeOtp(email, 'reset', parsed.data.otp);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : 'Invalid or expired code',
    });
  }

  const row = await queryOne<UserRow>(`SELECT * FROM users WHERE email = ?`, [email]);
  if (!row) return res.status(404).json({ message: 'User not found' });

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const now = new Date().toISOString();
  await execute(
    `UPDATE users SET password_hash = ?, email_verified = 1, updated_at = ? WHERE email = ?`,
    [passwordHash, now, email],
  );

  const tokens = signTokens(row);
  return res.json({
    user: publicUser({ ...row, email_verified: 1 }),
    tokens,
    rememberMe: true,
  });
});

authRouter.get('/me', requireAuth, async (req: AuthedRequest, res) => {
  const row = await queryOne<UserRow>(`SELECT * FROM users WHERE id = ?`, [req.userId!]);
  if (!row) return res.status(404).json({ message: 'User not found' });
  return res.json(publicUser(row));
});

authRouter.post('/logout', requireAuth, (_req, res) => {
  return res.json({ success: true });
});
