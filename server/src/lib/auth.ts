import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET ?? 'taskivo-dev-secret-change-me';
const ACCESS_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days for MVP

export type TokenPayload = {
  sub: string;
  email: string;
};

export function createId(prefix: string) {
  return `${prefix}_${uuid().replace(/-/g, '').slice(0, 12)}`;
}

export function signTokens(user: { id: string; email: string }) {
  const expiresAt = Date.now() + ACCESS_TTL_MS;
  const accessToken = jwt.sign(
    { sub: user.id, email: user.email } satisfies TokenPayload,
    JWT_SECRET,
    { expiresIn: '7d' },
  );
  const refreshToken = jwt.sign(
    { sub: user.id, email: user.email, typ: 'refresh' },
    JWT_SECRET,
    { expiresIn: '30d' },
  );
  return { accessToken, refreshToken, expiresAt };
}

export function verifyAccessToken(token: string): TokenPayload {
  const payload = jwt.verify(token, JWT_SECRET) as TokenPayload & { typ?: string };
  if (payload.typ === 'refresh') {
    throw new Error('Invalid access token');
  }
  return { sub: payload.sub, email: payload.email };
}

export function publicUser(row: {
  id: string;
  name: string;
  email: string;
  email_verified: number;
  avatar_url: string | null;
}) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    emailVerified: Boolean(row.email_verified),
    avatarUrl: row.avatar_url ?? undefined,
  };
}

export function mapTask(row: {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  category: string;
  tags_json: string;
  subtasks_json: string;
  due_at: string | null;
  reminder_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  is_completed: number;
}) {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    priority: row.priority,
    status: row.status,
    category: row.category,
    tags: JSON.parse(row.tags_json) as string[],
    subtasks: JSON.parse(row.subtasks_json) as Array<{
      id: string;
      title: string;
      isCompleted: boolean;
    }>,
    dueAt: row.due_at ?? undefined,
    reminderAt: row.reminder_at ?? undefined,
    completedAt: row.completed_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isCompleted: Boolean(row.is_completed),
  };
}

export function mapFocus(row: {
  id: string;
  task_id: string | null;
  task_title: string | null;
  duration_seconds: number;
  completed_seconds: number;
  started_at: string;
  ended_at: string;
  status: string;
}) {
  return {
    id: row.id,
    taskId: row.task_id ?? undefined,
    taskTitle: row.task_title ?? undefined,
    durationSeconds: row.duration_seconds,
    completedSeconds: row.completed_seconds,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    status: row.status,
  };
}
