import type { ActivityItem, OnboardingSlide, StatItem, UserProfile } from '@/types';
import { seedTasks } from '@/features/tasks';

export const mockUser: UserProfile = {
  id: '1',
  name: 'Alex Morgan',
  email: 'alex@taskivo.app',
  plan: 'pro',
};

/** @deprecated Prefer `useTasksQuery` from `@/features/tasks` */
export const mockTasks = seedTasks;

export const mockStats: StatItem[] = [
  {
    id: '1',
    label: 'Completed',
    value: 12,
    change: '+18%',
    trend: 'up',
    color: '#22C55E',
    icon: 'checkmark-circle-outline',
  },
  {
    id: '2',
    label: 'In Progress',
    value: 5,
    change: '+2',
    trend: 'up',
    color: '#16A34A',
    icon: 'play-circle-outline',
  },
  {
    id: '3',
    label: 'Focus Time',
    value: '3.2h',
    change: '+0.5h',
    trend: 'up',
    color: '#10B981',
    icon: 'timer-outline',
  },
  {
    id: '4',
    label: 'Streak',
    value: '8 days',
    change: 'Best',
    trend: 'neutral',
    color: '#84CC16',
    icon: 'flame-outline',
  },
];

export const mockActivity: ActivityItem[] = [
  {
    id: '1',
    title: 'Completed Budget review',
    subtitle: 'Finance',
    timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    type: 'completed',
  },
  {
    id: '2',
    title: 'Created Finalize product roadmap',
    subtitle: 'Work',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    type: 'created',
  },
  {
    id: '3',
    title: 'Reminder: Morning workout',
    subtitle: 'Health',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    type: 'reminder',
  },
];

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Organize everything',
    description: 'Capture tasks, plans, and priorities in one calm, beautiful workspace.',
    illustration: 'organize',
  },
  {
    id: '2',
    title: 'Stay deeply focused',
    description: 'Enter focus mode, clear distractions, and make meaningful progress every day.',
    illustration: 'focus',
  },
  {
    id: '3',
    title: 'Understand your rhythm',
    description: 'See patterns, celebrate streaks, and refine how you spend your time.',
    illustration: 'insights',
  },
];
