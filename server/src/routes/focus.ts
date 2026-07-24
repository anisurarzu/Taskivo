import { Router } from 'express';
import { z } from 'zod';
import { db } from '../lib/db.js';
import { createId, mapFocus } from '../lib/auth.js';
import { requireAuth, type AuthedRequest } from '../middleware/auth.js';

export const focusRouter = Router();
focusRouter.use(requireAuth);

focusRouter.get('/sessions', (req: AuthedRequest, res) => {
  const rows = db
    .prepare(
      `SELECT * FROM focus_sessions WHERE user_id = ? ORDER BY started_at DESC`,
    )
    .all(req.userId!) as Array<Parameters<typeof mapFocus>[0]>;
  return res.json(rows.map(mapFocus));
});

focusRouter.post('/sessions', (req: AuthedRequest, res) => {
  const schema = z.object({
    taskId: z.string().optional(),
    taskTitle: z.string().optional(),
    durationSeconds: z.number().int().positive(),
    completedSeconds: z.number().int().nonnegative(),
    startedAt: z.string(),
    status: z.enum(['completed', 'cancelled']),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid session payload' });

  const id = createId('focus');
  const endedAt = new Date().toISOString();
  db.prepare(
    `INSERT INTO focus_sessions (
      id, user_id, task_id, task_title, duration_seconds, completed_seconds,
      started_at, ended_at, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    req.userId!,
    parsed.data.taskId ?? null,
    parsed.data.taskTitle ?? null,
    parsed.data.durationSeconds,
    parsed.data.completedSeconds,
    parsed.data.startedAt,
    endedAt,
    parsed.data.status,
  );

  const row = db.prepare(`SELECT * FROM focus_sessions WHERE id = ?`).get(id) as Parameters<
    typeof mapFocus
  >[0];
  return res.status(201).json(mapFocus(row));
});

focusRouter.delete('/sessions', (req: AuthedRequest, res) => {
  db.prepare(`DELETE FROM focus_sessions WHERE user_id = ?`).run(req.userId!);
  return res.status(204).send();
});
