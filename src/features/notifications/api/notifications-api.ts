import { apiClient } from '@/services/api';

/** Notifications API — mirrors Taskivo-Web/src/services/api/notifications.ts */
export const notificationsApi = {
  list: () => apiClient.get('/notifications'),
  unreadCount: () => apiClient.get('/notifications/unread-count'),
  markRead: (id: string) => apiClient.post(`/notifications/${id}/read`),
  markAllRead: () => apiClient.post('/notifications/read-all'),
  remove: (id: string) => apiClient.delete(`/notifications/${id}`),
  clearAll: () => apiClient.delete('/notifications/clear-all'),
  accept: (id: string) => apiClient.post(`/notifications/${id}/accept`),
  decline: (id: string) => apiClient.post(`/notifications/${id}/decline`),
};
