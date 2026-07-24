import { z } from 'zod';
import { PRIORITIES, TASK_CATEGORIES, TASK_STATUSES } from '../types';

export const subtaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, 'Subtask title is required'),
  isCompleted: z.boolean(),
});

export const taskSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(2000).optional(),
  priority: z.enum(PRIORITIES),
  status: z.enum(TASK_STATUSES),
  category: z.enum(TASK_CATEGORIES),
  tags: z.array(z.string().trim().min(1)).default([]),
  subtasks: z.array(subtaskSchema).default([]),
  dueAt: z.string().datetime().optional(),
  reminderAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  isCompleted: z.boolean(),
});

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120, 'Keep title under 120 characters'),
  description: z
    .string()
    .trim()
    .max(2000, 'Description is too long')
    .optional()
    .or(z.literal('')),
  priority: z.enum(PRIORITIES).default('medium'),
  status: z.enum(TASK_STATUSES).default('todo'),
  category: z.enum(TASK_CATEGORIES).default('work'),
  tags: z.array(z.string().trim().min(1)).optional(),
  dueAt: z.string().datetime().nullable().optional(),
  reminderAt: z.string().datetime().nullable().optional(),
});

/** Form schema used by Create/Edit screens */
export const taskFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120, 'Keep title under 120 characters'),
  description: z.string().max(2000, 'Description is too long').optional().or(z.literal('')),
  priority: z.enum(PRIORITIES),
  category: z.enum(TASK_CATEGORIES),
  tagsText: z.string().optional().or(z.literal('')),
  dueAt: z.string().datetime().nullable().optional(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  isCompleted: z.boolean().optional(),
  description: z.string().trim().max(2000).nullable().optional(),
  dueAt: z.string().datetime().nullable().optional(),
  reminderAt: z.string().datetime().nullable().optional(),
  subtasks: z.array(subtaskSchema).optional(),
});

export type CreateTaskFormValues = z.infer<typeof createTaskSchema>;
export type UpdateTaskFormValues = z.infer<typeof updateTaskSchema>;
export type TaskFormValues = z.infer<typeof taskFormSchema>;
