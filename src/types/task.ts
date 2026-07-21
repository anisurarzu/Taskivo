export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'cancelled';

export type TaskCategory =
  | 'work'
  | 'personal'
  | 'health'
  | 'learning'
  | 'finance'
  | 'other';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  category: TaskCategory;
  dueAt?: string;
  completedAt?: string;
  createdAt: string;
  isCompleted: boolean;
}

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
