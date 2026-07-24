import type { Task } from '../types';

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getTodayTasks(tasks: Task[], now = new Date()) {
  return tasks.filter((task) => {
    if (task.isCompleted || !task.dueAt) return false;
    return isSameDay(new Date(task.dueAt), now);
  });
}

export function getUpcomingTasks(tasks: Task[], now = new Date()) {
  const todayStart = startOfDay(now).getTime();
  return tasks
    .filter((task) => {
      if (task.isCompleted || !task.dueAt) return false;
      const due = new Date(task.dueAt).getTime();
      return due >= todayStart + 24 * 60 * 60 * 1000;
    })
    .sort((a, b) => new Date(a.dueAt!).getTime() - new Date(b.dueAt!).getTime());
}

export function getActiveTasks(tasks: Task[]) {
  return tasks.filter((task) => !task.isCompleted);
}

export function getTasksForDate(tasks: Task[], date: Date) {
  return tasks.filter((task) => {
    if (!task.dueAt) return false;
    return isSameDay(new Date(task.dueAt), date);
  });
}

export function getEventDaysInMonth(tasks: Task[], monthCursor: Date) {
  const days = new Set<number>();
  tasks.forEach((task) => {
    if (!task.dueAt || task.isCompleted) return;
    const due = new Date(task.dueAt);
    if (
      due.getMonth() === monthCursor.getMonth() &&
      due.getFullYear() === monthCursor.getFullYear()
    ) {
      days.add(due.getDate());
    }
  });
  return days;
}

export function searchTasks(tasks: Task[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return tasks;
  return tasks.filter((task) => {
    const haystack = [
      task.title,
      task.description ?? '',
      task.category,
      task.priority,
      ...task.tags,
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function getTaskProgress(tasks: Task[]) {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter((task) => task.isCompleted).length;
  return Math.round((completed / tasks.length) * 100);
}
