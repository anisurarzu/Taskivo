export type NotificationType =
  | 'task_due'
  | 'task_reminder'
  | 'focus_complete'
  | 'weekly_summary'
  | 'system'
  | 'org_invite'
  | 'org_invite_accepted'
  | 'org_invite_declined'
  | 'chat_mention'
  | 'task_scheduled_start'
  | 'task_schedule_ending_soon'
  | (string & {});

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  type: NotificationType;
  relatedId?: string;
  status?: string;
  data?: Record<string, unknown>;
}

/** Remote notification shape from shared API. */
export type ApiNotification = {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, unknown>;
  status: string;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
};
