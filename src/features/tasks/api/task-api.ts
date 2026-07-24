import { apiClient } from '@/services/api';
import type { CreateTaskInput, TaskListFilter, UpdateTaskInput } from '../types';

/**
 * Axios API layer — ready for real backend endpoints.
 * Hooks currently use the mock service; swap here when API is live.
 */
export const taskApi = {
  list: (filter?: TaskListFilter) => apiClient.get('/tasks', { params: filter }),
  getById: (id: string) => apiClient.get(`/tasks/${id}`),
  create: (payload: CreateTaskInput) => apiClient.post('/tasks', payload),
  update: (id: string, payload: UpdateTaskInput) => apiClient.patch(`/tasks/${id}`, payload),
  remove: (id: string) => apiClient.delete(`/tasks/${id}`),
  toggleComplete: (id: string) => apiClient.post(`/tasks/${id}/toggle`),
};
