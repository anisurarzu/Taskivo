import axios from 'axios';
import { secureStorage } from '@/utils/secure-storage';

/**
 * API client scaffold — JWT-ready interceptors.
 */
export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'https://taskivo.onrender.com',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  try {
    const raw = await secureStorage.get('taskivo.auth.tokens');
    if (raw) {
      const tokens = JSON.parse(raw) as { accessToken?: string };
      if (tokens.accessToken) {
        config.headers.Authorization = `Bearer ${tokens.accessToken}`;
      }
    }
  } catch {
    // ignore missing tokens
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);
