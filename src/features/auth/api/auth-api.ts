import { apiClient } from '@/services/api';
import type { LoginPayload, RegisterPayload } from '../types';

/**
 * Auth API — mirrors Taskivo-Web/src/services/api/auth.ts
 */
export const authApi = {
  login: (payload: LoginPayload) => apiClient.post('/auth/login', payload),

  demoBrowse: () => apiClient.post('/auth/demo', {}),

  register: (payload: RegisterPayload) => apiClient.post('/auth/register', payload),

  forgotPassword: (email: string) => apiClient.post('/auth/forgot-password', { email }),

  resendOtp: (email: string, purpose: 'register' | 'reset' = 'register') =>
    apiClient.post('/auth/resend-otp', { email, purpose }),

  verifyOtp: (email: string, otp: string, purpose?: 'register' | 'reset') =>
    apiClient.post('/auth/verify-otp', { email, otp, purpose }),

  resetPassword: (payload: { email: string; otp: string; password: string }) =>
    apiClient.post('/auth/reset-password', payload),

  me: () => apiClient.get('/auth/me'),

  updateProfile: (body: { name?: string; bio?: string; avatarUrl?: string }) =>
    apiClient.patch('/auth/me', body),

  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    apiClient.post('/auth/change-password', body),

  logout: () => apiClient.post('/auth/logout'),

  refresh: (refreshToken: string) =>
    apiClient.post('/auth/refresh', { refreshToken }),
};
