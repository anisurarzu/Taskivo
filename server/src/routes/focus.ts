import { Router } from 'express';
import { z } from 'zod';
import { execute, queryAll, queryOne } from '../lib/db.js';
import { createId, mapFocus } from '../lib/auth.js';
import { requireAuth, type AuthedRequest } from '../middleware/auth.js';

export const focusRouter = Router();
focusRouter.use(requireAuth);

type FocusRow = Parameters<typeof mapFocus>[0];

focusRouter.get('/sessions', async (req: AuthedRequest, res) => {
  const rows = await queryAll<FocusRow>(
    `SELECT * FROM focus_sessions WHERE user_id = ? ORDER BY started_at DESC`,
    [req.userId!],
  );
  return res.json(rows.map(mapFocus));
});

focusRouter.post('/sessions', async (req: AuthedRequest, res) => {
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
  await execute(
    `INSERT INTO focus_sessions (
      id, user_id, task_id, task_title, duration_seconds, completed_seconds,
      started_at, ended_at, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      req.userId!,
      parsed.data.taskId ?? null,
      parsed.data.taskTitle ?? null,
      parsed.data.durationSeconds,
      parsed.data.completedSeconds,
      parsed.data.startedAt,
      endedAt,
      parsed.data.status,
    ],
  );

  const row = await queryOne<FocusRow>(`SELECT * FROM focus_sessions WHERE id = ?`, [id]);
  return res.status(201).json(mapFocus(row!));
});

focusRouter.delete('/sessions', async (req: AuthedRequest, res) => {
  await execute(`DELETE FROM focus_sessions WHERE user_id = ?`, [req.userId!]);
  return res.status(204).send();
});
