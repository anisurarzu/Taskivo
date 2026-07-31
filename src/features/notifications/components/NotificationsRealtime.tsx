import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import { API_CONFIG, isMockApi } from '@/services/api';
import { useAuthStore } from '@/features/auth';
import { taskKeys } from '@/features/tasks/hooks/query-keys';
import { notificationKeys } from '../hooks/useNotifications';
import type { ApiNotification, AppNotification } from '../types';

function mapRemote(item: ApiNotification): AppNotification {
  return {
    id: item.id,
    title: item.title,
    body: item.body,
    createdAt: item.createdAt,
    read: Boolean(item.readAt),
    type: item.type,
    status: item.status,
    data: item.data,
  };
}

/** User-scoped socket for notification + task pushes (shared API). */
export function NotificationsRealtime() {
  const accessToken = useAuthStore((s) => s.session?.tokens.accessToken);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isMockApi() || !accessToken || !isAuthenticated) return;

    const socket = io(API_CONFIG.baseUrl, {
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
    });

    socket.on('notification:new', (notification: ApiNotification) => {
      queryClient.setQueryData<AppNotification[]>(notificationKeys.feed(), (current) => {
        const list = current ?? [];
        if (list.some((item) => item.id === notification.id)) return list;
        return [mapRemote(notification), ...list];
      });
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    });

    socket.on('task:updated', () => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.all });
    });

    return () => {
      socket.disconnect();
    };
  }, [accessToken, isAuthenticated, queryClient]);

  return null;
}
