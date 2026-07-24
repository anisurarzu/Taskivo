export type NotificationType =
  | 'task_due'
  | 'task_reminder'
  | 'focus_complete'
  | 'weekly_summary'
  | 'system';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  type: NotificationType;
  relatedId?: string;
}
