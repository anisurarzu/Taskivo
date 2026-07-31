import { apiClient } from '@/services/api';
import type { CreateFocusSessionInput } from '../types';

/** Focus API — mirrors Taskivo-Web/src/services/api/focus.ts */
export const focusApi = {
  list: () => apiClient.get('/focus/sessions'),
  create: (payload: CreateFocusSessionInput) => apiClient.post('/focus/sessions', payload),
};
