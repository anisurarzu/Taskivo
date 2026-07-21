import axios from 'axios';

/**
 * API client scaffold — no business logic yet.
 * Wire base URL and interceptors when backend is ready.
 */
export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'https://api.taskivo.app',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  // Attach auth token from Secure Store when auth is implemented.
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);
