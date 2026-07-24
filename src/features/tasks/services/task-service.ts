import type { CreateTaskInput, Task, TaskListFilter, UpdateTaskInput } from '../types';
import { taskStorage } from './task-storage';

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

function createId(prefix = 'task') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeDateKey(iso?: string) {
  if (!iso) return null;
  return iso.slice(0, 10);
}

function applyFilters(tasks: Task[], filter?: TaskListFilter) {
  if (!filter) return tasks;

  return tasks.filter((task) => {
    if (filter.status === 'active' && task.isCompleted) return false;
    if (filter.status && filter.status !== 'all' && filter.status !== 'active') {
      if (task.status !== filter.status) return false;
    }
    if (filter.category && task.category !== filter.category) return false;
    if (filter.priority && task.priority !== filter.priority) return false;
    if (filter.dueOn && normalizeDateKey(task.dueAt) !== filter.dueOn) return false;

    if (filter.query) {
      const q = filter.query.trim().toLowerCase();
      if (!q) return true;
      const haystack = [
        task.title,
        task.description ?? '',
        task.category,
        task.priority,
        ...task.tags,
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  });
}

/**
 * Mock task service — swap for real API later without changing screens.
 */
export const taskService = {
  async list(filter?: TaskListFilter): Promise<Task[]> {
    await delay();
    const tasks = taskStorage.load();
    return applyFilters(tasks, filter).sort((a, b) => {
      const aTime = a.dueAt ? new Date(a.dueAt).getTime() : Number.MAX_SAFE_INTEGER;
      const bTime = b.dueAt ? new Date(b.dueAt).getTime() : Number.MAX_SAFE_INTEGER;
      return aTime - bTime;
    });
  },

  async getById(id: string): Promise<Task | null> {
    await delay(150);
    return taskStorage.load().find((task) => task.id === id) ?? null;
  },

  async create(input: CreateTaskInput): Promise<Task> {
    await delay();
    const timestamp = new Date().toISOString();
    const task: Task = {
      id: createId(),
      title: input.title.trim(),
      description: input.description?.trim() || undefined,
      priority: input.priority ?? 'medium',
      status: input.status ?? 'todo',
      category: input.category ?? 'work',
      tags: input.tags ?? [],
      subtasks: (input.subtasks ?? []).map((item) => ({
        id: createId('st'),
        title: item.title.trim(),
        isCompleted: Boolean(item.isCompleted),
      })),
      dueAt: input.dueAt ?? undefined,
      reminderAt: input.reminderAt ?? undefined,
      createdAt: timestamp,
      updatedAt: timestamp,
      isCompleted: false,
    };

    const next = [task, ...taskStorage.load()];
    taskStorage.save(next);
    return task;
  },

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    await delay();
    const tasks = taskStorage.load();
    const index = tasks.findIndex((task) => task.id === id);
    if (index < 0) {
      throw new Error('Task not found');
    }

    const current = tasks[index]!;
    const isCompleted =
      input.isCompleted ??
      (input.status === 'completed' ? true : input.status ? false : current.isCompleted);

    const updated: Task = {
      ...current,
      title: input.title?.trim() ?? current.title,
      description:
        input.description === null
          ? undefined
          : input.description !== undefined
            ? input.description.trim() || undefined
            : current.description,
      priority: input.priority ?? current.priority,
      status:
        input.status ??
        (isCompleted ? 'completed' : current.status === 'completed' ? 'todo' : current.status),
      category: input.category ?? current.category,
      tags: input.tags ?? current.tags,
      subtasks: input.subtasks ?? current.subtasks,
      dueAt:
        input.dueAt === null ? undefined : input.dueAt !== undefined ? input.dueAt : current.dueAt,
      reminderAt:
        input.reminderAt === null
          ? undefined
          : input.reminderAt !== undefined
            ? input.reminderAt
            : current.reminderAt,
      isCompleted,
      completedAt: isCompleted
        ? current.completedAt ?? new Date().toISOString()
        : undefined,
      updatedAt: new Date().toISOString(),
    };

    const next = [...tasks];
    next[index] = updated;
    taskStorage.save(next);
    return updated;
  },

  async toggleComplete(id: string): Promise<Task> {
    const task = await this.getById(id);
    if (!task) throw new Error('Task not found');
    return this.update(id, {
      isCompleted: !task.isCompleted,
      status: !task.isCompleted ? 'completed' : 'todo',
    });
  },

  async remove(id: string): Promise<void> {
    await delay(150);
    const next = taskStorage.load().filter((task) => task.id !== id);
    taskStorage.save(next);
  },

  async reset(): Promise<Task[]> {
    await delay(100);
    return taskStorage.reset();
  },
};
