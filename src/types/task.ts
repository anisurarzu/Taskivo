export type {
  Priority,
  TaskStatus,
  TaskCategory,
  Task,
  TaskSubtask,
  CreateTaskInput,
  UpdateTaskInput,
  TaskListFilter,
} from '@/features/tasks/types';

export interface StatItem {
  id: string;
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
  color?: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  type: 'completed' | 'created' | 'updated' | 'reminder';
}

export interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  illustration: 'organize' | 'focus' | 'insights';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  plan: 'free' | 'pro';
}
