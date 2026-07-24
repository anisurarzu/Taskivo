import { Router } from 'express';
import { z } from 'zod';
import { db } from '../lib/db.js';
import { createId, mapTask } from '../lib/auth.js';
import { requireAuth, type AuthedRequest } from '../middleware/auth.js';

export const tasksRouter = Router();
tasksRouter.use(requireAuth);

const createSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().max(2000).optional().nullable(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  status: z.enum(['todo', 'in_progress', 'completed', 'cancelled']).optional(),
  category: z
    .enum(['work', 'personal', 'health', 'learning', 'finance', 'other'])
    .optional(),
  tags: z.array(z.string()).optional(),
  subtasks: z
    .array(
      z.object({
        title: z.string().min(1),
        isCompleted: z.boolean().optional(),
      }),
    )
    .optional(),
  dueAt: z.string().nullable().optional(),
  reminderAt: z.string().nullable().optional(),
});

tasksRouter.get('/', (req: AuthedRequest, res) => {
  const rows = db
    .prepare(`SELECT * FROM tasks WHERE user_id = ? ORDER BY updated_at DESC`)
    .all(req.userId!) as Array<Parameters<typeof mapTask>[0] & { user_id: string }>;

  let tasks = rows.map(mapTask);
  const { status, category, priority, query, dueOn } = req.query;

  if (status === 'active') tasks = tasks.filter((t) => !t.isCompleted);
  else if (typeof status === 'string' && status !== 'all') {
    tasks = tasks.filter((t) => t.status === status);
  }
  if (typeof category === 'string') tasks = tasks.filter((t) => t.category === category);
  if (typeof priority === 'string') tasks = tasks.filter((t) => t.priority === priority);
  if (typeof dueOn === 'string') {
    tasks = tasks.filter((t) => t.dueAt?.slice(0, 10) === dueOn);
  }
  if (typeof query === 'string' && query.trim()) {
    const q = query.trim().toLowerCase();
    tasks = tasks.filter((t) =>
      [t.title, t.description ?? '', t.category, t.priority, ...t.tags]
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }

  return res.json(tasks);
});

tasksRouter.get('/:id', (req: AuthedRequest, res) => {
  const row = db
    .prepare(`SELECT * FROM tasks WHERE id = ? AND user_id = ?`)
    .get(req.params.id, req.userId!) as Parameters<typeof mapTask>[0] | undefined;
  if (!row) return res.status(404).json({ message: 'Task not found' });
  return res.json(mapTask(row));
});

tasksRouter.post('/', (req: AuthedRequest, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid task payload' });

  const now = new Date().toISOString();
  const id = createId('task');
  const input = parsed.data;
  const subtasks = (input.subtasks ?? []).map((item) => ({
    id: createId('st'),
    title: item.title,
    isCompleted: Boolean(item.isCompleted),
  }));

  db.prepare(
    `INSERT INTO tasks (
      id, user_id, title, description, priority, status, category,
      tags_json, subtasks_json, due_at, reminder_at, created_at, updated_at, is_completed
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
  ).run(
    id,
    req.userId!,
    input.title.trim(),
    input.description?.trim() || null,
    input.priority ?? 'medium',
    input.status ?? 'todo',
    input.category ?? 'work',
    JSON.stringify(input.tags ?? []),
    JSON.stringify(subtasks),
    input.dueAt ?? null,
    input.reminderAt ?? null,
    now,
    now,
  );

  const row = db.prepare(`SELECT * FROM tasks WHERE id = ?`).get(id) as Parameters<
    typeof mapTask
  >[0];
  return res.status(201).json(mapTask(row));
});

tasksRouter.patch('/:id', (req: AuthedRequest, res) => {
  const existing = db
    .prepare(`SELECT * FROM tasks WHERE id = ? AND user_id = ?`)
    .get(req.params.id, req.userId!) as
    | (Parameters<typeof mapTask>[0] & { user_id: string })
    | undefined;
  if (!existing) return res.status(404).json({ message: 'Task not found' });

  const body = req.body ?? {};
  const current = mapTask(existing);
  const isCompleted =
    typeof body.isCompleted === 'boolean'
      ? body.isCompleted
      : body.status === 'completed'
        ? true
        : body.status
          ? false
          : current.isCompleted;

  const next = {
    title: typeof body.title === 'string' ? body.title.trim() : current.title,
    description:
      body.description === null
        ? null
        : typeof body.description === 'string'
          ? body.description.trim() || null
          : existing.description,
    priority: body.priority ?? current.priority,
    status: body.status ?? (isCompleted ? 'completed' : current.status === 'completed' ? 'todo' : current.status),
    category: body.category ?? current.category,
    tags_json: JSON.stringify(body.tags ?? current.tags),
    subtasks_json: JSON.stringify(body.subtasks ?? current.subtasks),
    due_at: body.dueAt === null ? null : body.dueAt !== undefined ? body.dueAt : existing.due_at,
    reminder_at:
      body.reminderAt === null
        ? null
        : body.reminderAt !== undefined
          ? body.reminderAt
          : existing.reminder_at,
    is_completed: isCompleted ? 1 : 0,
    completed_at: isCompleted ? current.completedAt ?? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  db.prepare(
    `UPDATE tasks SET
      title = ?, description = ?, priority = ?, status = ?, category = ?,
      tags_json = ?, subtasks_json = ?, due_at = ?, reminder_at = ?,
      is_completed = ?, completed_at = ?, updated_at = ?
     WHERE id = ? AND user_id = ?`,
  ).run(
    next.title,
    next.description,
    next.priority,
    next.status,
    next.category,
    next.tags_json,
    next.subtasks_json,
    next.due_at,
    next.reminder_at,
    next.is_completed,
    next.completed_at,
    next.updated_at,
    req.params.id,
    req.userId!,
  );

  const row = db.prepare(`SELECT * FROM tasks WHERE id = ?`).get(req.params.id) as Parameters<
    typeof mapTask
  >[0];
  return res.json(mapTask(row));
});

tasksRouter.post('/:id/toggle', (req: AuthedRequest, res) => {
  const existing = db
    .prepare(`SELECT * FROM tasks WHERE id = ? AND user_id = ?`)
    .get(req.params.id, req.userId!) as Parameters<typeof mapTask>[0] | undefined;
  if (!existing) return res.status(404).json({ message: 'Task not found' });

  const current = mapTask(existing);
  const isCompleted = !current.isCompleted;
  const now = new Date().toISOString();
  db.prepare(
    `UPDATE tasks SET is_completed = ?, status = ?, completed_at = ?, updated_at = ?
     WHERE id = ? AND user_id = ?`,
  ).run(
    isCompleted ? 1 : 0,
    isCompleted ? 'completed' : 'todo',
    isCompleted ? now : null,
    now,
    req.params.id,
    req.userId!,
  );

  const row = db.prepare(`SELECT * FROM tasks WHERE id = ?`).get(req.params.id) as Parameters<
    typeof mapTask
  >[0];
  return res.json(mapTask(row));
});

tasksRouter.delete('/:id', (req: AuthedRequest, res) => {
  const result = db
    .prepare(`DELETE FROM tasks WHERE id = ? AND user_id = ?`)
    .run(req.params.id, req.userId!);
  if (result.changes === 0) return res.status(404).json({ message: 'Task not found' });
  return res.status(204).send();
});
