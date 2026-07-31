export const PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
export const TASK_STATUSES = ['todo', 'in_progress', 'completed', 'cancelled'] as const;
export const TASK_CATEGORIES = [
  'work',
  'personal',
  'health',
  'learning',
  'finance',
  'other',
] as const;

export type Priority = (typeof PRIORITIES)[number];
export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskCategory = (typeof TASK_CATEGORIES)[number];

export interface TaskSubtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

/** Tracking summary attached by the shared web API. */
export type TaskTracking = {
  trackingStatus:
    | 'not_started'
    | 'working'
    | 'on_break'
    | 'ended'
    | 'completed'
    | string;
  scheduledStartAt?: string;
  actualStartedAt?: string;
  trackingCompletedAt?: string;
  scheduledElapsedMs: number;
  workMs: number;
  breakMs: number;
  idleMs: number;
  efficiencyPct: number;
  progressPct: number;
};

export interface Task {
  id: string;
  title: string;
  description?: string;
  images?: string[];
  priority: Priority;
  status: TaskStatus;
  /** Shared API may return any string category. */
  category: TaskCategory | string;
  tags: string[];
  subtasks: TaskSubtask[];
  userId?: string;
  organizationId?: string;
  teamId?: string;
  assigneeId?: string;
  assigneeIds?: string[];
  budgetId?: string;
  budgetAllocated?: number;
  dueAt?: string;
  reminderAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  isCompleted: boolean;
  scheduledStartAt?: string;
  scheduledEndAt?: string;
  trackingStatus?: string;
  tracking?: TaskTracking;
  totalWorkMs?: number;
  totalBreakMs?: number;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  images?: string[];
  priority?: Priority;
  status?: TaskStatus;
  category?: TaskCategory;
  tags?: string[];
  subtasks?: Array<Pick<TaskSubtask, 'title'> & { isCompleted?: boolean }>;
  dueAt?: string | null;
  reminderAt?: string | null;
  organizationId?: string | null;
  teamId?: string | null;
  assigneeIds?: string[];
  budgetId?: string | null;
  budgetAllocated?: number;
  scheduledStartAt?: string | null;
  scheduledEndAt?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  images?: string[];
  priority?: Priority;
  status?: TaskStatus;
  category?: TaskCategory;
  tags?: string[];
  subtasks?: TaskSubtask[];
  dueAt?: string | null;
  reminderAt?: string | null;
  isCompleted?: boolean;
  organizationId?: string | null;
  teamId?: string | null;
  assigneeIds?: string[];
  budgetId?: string | null;
  budgetAllocated?: number;
  scheduledStartAt?: string | null;
  scheduledEndAt?: string | null;
}

export type TaskListFilter = {
  status?: TaskStatus | 'active' | 'all';
  category?: TaskCategory;
  priority?: Priority;
  query?: string;
  dueOn?: string; // ISO date yyyy-mm-dd
  organizationId?: string;
  teamId?: string;
};
