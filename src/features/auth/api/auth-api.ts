import { apiClient } from '@/services/api';
import type { LoginPayload, RegisterPayload } from '../types';

/**
 * Axios API layer — ready for real backend endpoints.
 * Screens should prefer React Query hooks which call this module.
 */
export const authApi = {
  login: (payload: LoginPayload) => apiClient.post('/auth/login', payload),
  register: (payload: RegisterPayload) => apiClient.post('/auth/register', payload),
  forgotPassword: (email: string) => apiClient.post('/auth/forgot-password', { email }),
  verifyOtp: (email: string, otp: string) =>
    apiClient.post('/auth/verify-otp', { email, otp }),
  resetPassword: (payload: {
    email: string;
    otp: string;
    password: string;
  }) => apiClient.post('/auth/reset-password', payload),
  me: () => apiClient.get('/auth/me'),
  logout: () => apiClient.post('/auth/logout'),
};
