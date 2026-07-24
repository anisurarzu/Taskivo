import type { Task } from '@/features/tasks';
import type { FocusSession } from '@/features/focus';
import {
  formatFocusDuration,
  getFocusSecondsThisWeek,
  getFocusStreakDays,
  getTotalFocusSeconds,
} from '@/features/focus';
import type { StatItem } from '@/types';
import { colors } from '@/theme/colors';

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

export function getWeeklyCompletionBars(tasks: Task[], now = new Date()) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const monday = startOfDay(now);
  const day = monday.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + offset);

  const bars = days.map((label, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const dueThatDay = tasks.filter((task) => task.dueAt && isSameDay(new Date(task.dueAt), date));
    const completedThatDay = tasks.filter((task) => {
      if (!task.isCompleted) return false;
      const stamp = task.completedAt ?? task.updatedAt;
      return isSameDay(new Date(stamp), date);
    });
    const total = Math.max(dueThatDay.length, completedThatDay.length, 1);
    const value = Math.round((completedThatDay.length / total) * 100);
    return {
      label,
      value: Math.min(100, Math.max(8, value || (completedThatDay.length > 0 ? 40 : 8))),
      count: completedThatDay.length,
    };
  });

  return bars;
}

export function getMostProductiveDay(tasks: Task[]) {
  const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const counts = Array.from({ length: 7 }, () => 0);
  tasks.forEach((task) => {
    if (!task.isCompleted) return;
    const stamp = task.completedAt ?? task.updatedAt;
    counts[new Date(stamp).getDay()] += 1;
  });
  const max = Math.max(...counts);
  if (max <= 0) return '—';
  return names[counts.indexOf(max)] ?? '—';
}

export function getAverageTasksPerDay(tasks: Task[], now = new Date()) {
  const completed = tasks.filter((task) => task.isCompleted);
  if (completed.length === 0) return '0';
  const oldest = completed.reduce((min, task) => {
    const t = new Date(task.completedAt ?? task.createdAt).getTime();
    return Math.min(min, t);
  }, now.getTime());
  const days = Math.max(1, Math.ceil((now.getTime() - oldest) / (24 * 60 * 60 * 1000)));
  return (completed.length / days).toFixed(1);
}

export function buildAnalytics(tasks: Task[], sessions: FocusSession[]) {
  const completed = tasks.filter((task) => task.isCompleted).length;
  const inProgress = tasks.filter((task) => !task.isCompleted).length;
  const focusSeconds = getTotalFocusSeconds(sessions);
  const streak = getFocusStreakDays(sessions);
  const weekFocus = getFocusSecondsThisWeek(sessions);

  const stats: StatItem[] = [
    {
      id: 'completed',
      label: 'Completed',
      value: completed,
      icon: 'checkmark-circle',
      color: colors.primary,
      trend: 'up',
    },
    {
      id: 'active',
      label: 'Active',
      value: inProgress,
      icon: 'flash',
      color: colors.secondary,
      trend: 'neutral',
    },
    {
      id: 'focus',
      label: 'Focus time',
      value: formatFocusDuration(focusSeconds),
      icon: 'timer',
      color: colors.accent,
      change: `${formatFocusDuration(weekFocus)} wk`,
      trend: 'up',
    },
    {
      id: 'streak',
      label: 'Streak',
      value: `${streak}d`,
      icon: 'flame',
      color: colors.warning,
      trend: streak > 0 ? 'up' : 'neutral',
    },
  ];

  const weekBars = getWeeklyCompletionBars(tasks);
  const insights = [
    {
      title: 'Focus this week',
      value: formatFocusDuration(weekFocus),
    },
    {
      title: 'Most productive day',
      value: getMostProductiveDay(tasks),
    },
    {
      title: 'Avg. tasks / day',
      value: getAverageTasksPerDay(tasks),
    },
  ];

  return { stats, weekBars, insights, streak, completed, inProgress };
}
