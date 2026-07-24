export const FOCUS_PRESETS_MINUTES = [5, 15, 25, 45, 60] as const;

export type FocusSessionStatus = 'completed' | 'cancelled';

export interface FocusSession {
  id: string;
  taskId?: string;
  taskTitle?: string;
  durationSeconds: number;
  completedSeconds: number;
  startedAt: string;
  endedAt: string;
  status: FocusSessionStatus;
}

export interface CreateFocusSessionInput {
  taskId?: string;
  taskTitle?: string;
  durationSeconds: number;
  completedSeconds: number;
  startedAt: string;
  status: FocusSessionStatus;
}
