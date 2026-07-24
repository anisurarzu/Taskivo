import { apiClient } from '@/services/api';
import type { LoginPayload, RegisterPayload } from '../types';

/**
 * Axios API layer for real backend auth endpoints.
 */
export const authApi = {
  login: (payload: LoginPayload) => apiClient.post('/auth/login', payload),
  register: (payload: RegisterPayload) => apiClient.post('/auth/register', payload),
  forgotPassword: (email: string) => apiClient.post('/auth/forgot-password', { email }),
  verifyOtp: (email: string, otp: string, purpose?: 'register' | 'reset') =>
    apiClient.post('/auth/verify-otp', { email, otp, purpose }),
  resetPassword: (payload: {
    email: string;
    otp: string;
    password: string;
  }) => apiClient.post('/auth/reset-password', payload),
  me: () => apiClient.get('/auth/me'),
  logout: () => apiClient.post('/auth/logout'),
};
