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

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  category: TaskCategory;
  tags: string[];
  subtasks: TaskSubtask[];
  dueAt?: string;
  reminderAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  isCompleted: boolean;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: Priority;
  status?: TaskStatus;
  category?: TaskCategory;
  tags?: string[];
  subtasks?: Array<Pick<TaskSubtask, 'title'> & { isCompleted?: boolean }>;
  dueAt?: string | null;
  reminderAt?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  priority?: Priority;
  status?: TaskStatus;
  category?: TaskCategory;
  tags?: string[];
  subtasks?: TaskSubtask[];
  dueAt?: string | null;
  reminderAt?: string | null;
  isCompleted?: boolean;
}

export type TaskListFilter = {
  status?: TaskStatus | 'active' | 'all';
  category?: TaskCategory;
  priority?: Priority;
  query?: string;
  dueOn?: string; // ISO date yyyy-mm-dd
};
