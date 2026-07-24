import type { Task } from '../types';

const hoursFromNow = (hours: number) =>
  new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

const now = () => new Date().toISOString();

/** Seed dataset used when local storage is empty. */
export const seedTasks: Task[] = [
  {
    id: 'task_1',
    title: 'Finalize product roadmap',
    description: 'Align Q3 priorities with design and engineering.',
    priority: 'high',
    status: 'in_progress',
    category: 'work',
    tags: ['roadmap', 'planning'],
    subtasks: [
      { id: 'st_1', title: 'Draft outline', isCompleted: true },
      { id: 'st_2', title: 'Share with team', isCompleted: false },
    ],
    dueAt: hoursFromNow(2),
    createdAt: now(),
    updatedAt: now(),
    isCompleted: false,
  },
  {
    id: 'task_2',
    title: 'Morning workout',
    description: '45 min strength session',
    priority: 'medium',
    status: 'todo',
    category: 'health',
    tags: ['fitness'],
    subtasks: [],
    dueAt: hoursFromNow(5),
    createdAt: now(),
    updatedAt: now(),
    isCompleted: false,
  },
  {
    id: 'task_3',
    title: 'Review analytics dashboard',
    description: 'Check weekly completion and focus trends.',
    priority: 'urgent',
    status: 'todo',
    category: 'work',
    tags: ['analytics'],
    subtasks: [],
    dueAt: hoursFromNow(8),
    createdAt: now(),
    updatedAt: now(),
    isCompleted: false,
  },
  {
    id: 'task_4',
    title: 'Read design systems chapter',
    description: 'Finish chapter on spacing and typography.',
    priority: 'low',
    status: 'todo',
    category: 'learning',
    tags: ['reading'],
    subtasks: [],
    dueAt: hoursFromNow(26),
    createdAt: now(),
    updatedAt: now(),
    isCompleted: false,
  },
  {
    id: 'task_5',
    title: 'Budget review',
    description: 'Reconcile monthly expenses.',
    priority: 'medium',
    status: 'completed',
    category: 'finance',
    tags: ['money'],
    subtasks: [],
    dueAt: hoursFromNow(-2),
    completedAt: now(),
    createdAt: now(),
    updatedAt: now(),
    isCompleted: true,
  },
];
