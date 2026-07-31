import { apiClient } from '@/services/api';
import type { CreateTaskInput, TaskListFilter, UpdateTaskInput } from '../types';

/**
 * Tasks API — mirrors Taskivo-Web/src/services/api/tasks.ts
 */
export const taskApi = {
  list: (filter?: TaskListFilter) => apiClient.get('/tasks', { params: filter }),
  getById: (id: string) => apiClient.get(`/tasks/${id}`),
  create: (payload: CreateTaskInput) => apiClient.post('/tasks', payload),
  update: (id: string, payload: UpdateTaskInput) => apiClient.patch(`/tasks/${id}`, payload),
  remove: (id: string) => apiClient.delete(`/tasks/${id}`),
  toggleComplete: (id: string) => apiClient.post(`/tasks/${id}/toggle`),
  trackingStart: (id: string) => apiClient.post(`/tasks/${id}/tracking/start`),
  trackingBreak: (id: string, body?: { plannedBreakMinutes?: number }) =>
    apiClient.post(`/tasks/${id}/tracking/break`, body ?? {}),
  trackingResume: (id: string) => apiClient.post(`/tasks/${id}/tracking/resume`),
  trackingEnd: (id: string) => apiClient.post(`/tasks/${id}/tracking/end`),
  trackingComplete: (id: string) => apiClient.post(`/tasks/${id}/tracking/complete`),
};
