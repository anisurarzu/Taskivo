import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getApiErrorMessage, isMockApi } from '@/services/api';
import { notificationService } from '../services/notification-service';
import { notificationsApi } from '../api/notifications-api';
import { buildDueSoonNotifications } from '../utils/reminders';
import type { ApiNotification, AppNotification } from '../types';
import type { Task } from '@/features/tasks/types';

export const notificationKeys = {
  all: ['notifications'] as const,
  feed: () => [...notificationKeys.all, 'feed'] as const,
  unread: () => [...notificationKeys.all, 'unread'] as const,
};

function mapRemote(item: ApiNotification): AppNotification {
  const relatedId =
    (typeof item.data?.teamId === 'string' && item.data.teamId) ||
    (typeof item.data?.organizationId === 'string' && item.data.organizationId) ||
    (typeof item.data?.taskId === 'string' && item.data.taskId) ||
    undefined;

  return {
    id: item.id,
    title: item.title,
    body: item.body,
    createdAt: item.createdAt,
    read: Boolean(item.readAt),
    type: item.type,
    relatedId,
    status: item.status,
    data: item.data,
  };
}

async function loadFeed(tasks: Task[]): Promise<AppNotification[]> {
  if (isMockApi()) {
    buildDueSoonNotifications(tasks);
    return notificationService.listFeed();
  }

  try {
    const { data } = await notificationsApi.list();
    const remote = (data as ApiNotification[]).map(mapRemote);
    const remoteIds = new Set(remote.map((n) => n.id));
    // Keep local-only items (e.g. focus complete feed entries) until server mirrors them.
    const localOnly = notificationService
      .listFeed()
      .filter((item) => !remoteIds.has(item.id));
    return [...remote, ...localOnly].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to load notifications'));
  }
}

export function useNotificationsQuery(tasks: Task[] = []) {
  return useQuery({
    queryKey: notificationKeys.feed(),
    queryFn: () => loadFeed(tasks),
  });
}

export function useMarkNotificationsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (isMockApi()) {
        notificationService.markAllRead();
        return;
      }
      await notificationsApi.markAllRead();
      notificationService.markAllRead();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useRequestNotificationPermissionMutation() {
  return useMutation({
    mutationFn: () => notificationService.requestPermissions(),
  });
}
