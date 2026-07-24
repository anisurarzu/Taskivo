import type { Task } from '@/features/tasks/types';
import { notificationService, notificationStorage } from '../services/notification-service';

/**
 * Keep local OS reminders in sync with task due dates.
 */
export async function syncTaskReminder(task: Task) {
  const map = notificationStorage.loadReminders();
  const existingId = map[task.id];

  if (existingId) {
    await notificationService.cancel(existingId);
    delete map[task.id];
  }

  if (task.isCompleted || !task.dueAt) {
    notificationStorage.saveReminders(map);
    return;
  }

  const remindAt = task.reminderAt ? new Date(task.reminderAt) : new Date(task.dueAt);
  const { id } = await notificationService.scheduleLocal(
    'Task reminder',
    `${task.title} is due soon`,
    remindAt,
  );

  if (id) {
    map[task.id] = id;
    notificationService.pushFeed({
      title: 'Reminder scheduled',
      body: `We’ll nudge you before “${task.title}” is due.`,
      type: 'task_reminder',
      relatedId: task.id,
    });
  }

  notificationStorage.saveReminders(map);
}

export async function cancelTaskReminder(taskId: string) {
  const map = notificationStorage.loadReminders();
  const existingId = map[taskId];
  if (existingId) {
    await notificationService.cancel(existingId);
    delete map[taskId];
    notificationStorage.saveReminders(map);
  }
}

export function buildDueSoonNotifications(tasks: Task[]): void {
  const feed = notificationService.listFeed();
  const now = Date.now();
  const horizon = now + 6 * 60 * 60 * 1000;

  tasks.forEach((task) => {
    if (task.isCompleted || !task.dueAt) return;
    const due = new Date(task.dueAt).getTime();
    if (due < now || due > horizon) return;
    const already = feed.some(
      (item) => item.type === 'task_due' && item.relatedId === task.id,
    );
    if (already) return;
    notificationService.pushFeed({
      title: 'Task due soon',
      body: `${task.title} is due within 6 hours`,
      type: 'task_due',
      relatedId: task.id,
    });
  });
}
