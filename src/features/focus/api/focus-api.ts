import { apiClient } from '@/services/api';
import type { CreateFocusSessionInput } from '../types';

/** Axios scaffold — swap in when backend focus endpoints are live. */
export const focusApi = {
  list: () => apiClient.get('/focus/sessions'),
  create: (payload: CreateFocusSessionInput) => apiClient.post('/focus/sessions', payload),
  clear: () => apiClient.delete('/focus/sessions'),
};
