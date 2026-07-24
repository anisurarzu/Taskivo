import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notification-service';
import { buildDueSoonNotifications } from '../utils/reminders';
import type { Task } from '@/features/tasks/types';

export const notificationKeys = {
  all: ['notifications'] as const,
  feed: () => [...notificationKeys.all, 'feed'] as const,
};

export function useNotificationsQuery(tasks: Task[] = []) {
  return useQuery({
    queryKey: notificationKeys.feed(),
    queryFn: () => {
      buildDueSoonNotifications(tasks);
      return notificationService.listFeed();
    },
  });
}

export function useMarkNotificationsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => notificationService.markAllRead(),
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
