import type { CreateFocusSessionInput, FocusSession } from '../types';
import { focusStorage } from './focus-storage';

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

function createId() {
  return `focus_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export const focusService = {
  async list(): Promise<FocusSession[]> {
    await delay();
    return focusStorage
      .load()
      .slice()
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  },

  async create(input: CreateFocusSessionInput): Promise<FocusSession> {
    await delay();
    const session: FocusSession = {
      id: createId(),
      taskId: input.taskId,
      taskTitle: input.taskTitle,
      durationSeconds: input.durationSeconds,
      completedSeconds: input.completedSeconds,
      startedAt: input.startedAt,
      endedAt: new Date().toISOString(),
      status: input.status,
    };
    const next = [session, ...focusStorage.load()];
    focusStorage.save(next);
    return session;
  },

  async clear(): Promise<void> {
    await delay(80);
    focusStorage.reset();
  },
};
