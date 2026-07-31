import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { secureStorage } from '@/utils/secure-storage';
import { API_CONFIG } from './config';

export type ApiErrorBody = {
  message?: string;
  requiresVerification?: boolean;
  email?: string;
  [key: string]: unknown;
};

type UnauthorizedHandler = () => void;
let onUnauthorized: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  onUnauthorized = handler;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Shared Taskivo API client — same backend as Taskivo-Web.
 * Base paths have no `/api` prefix. Auth header: Bearer accessToken.
 */
export const apiClient = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: 90000,
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

const PUBLIC_AUTH_PATH =
  /\/auth\/(login|register|demo|forgot-password|resend-otp|verify-otp|reset-password|refresh)(\?|$)/;

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const url = error.config?.url ?? '';
    if (error.response?.status === 401 && !PUBLIC_AUTH_PATH.test(url)) {
      onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);

/** Ping /health so a sleeping Render instance can wake before auth calls. */
export async function wakeApi(maxAttempts = 4): Promise<boolean> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const res = await apiClient.get('/health', {
        timeout: 20000,
        // avoid auth interceptor noise
        headers: { Authorization: undefined },
      } as AxiosRequestConfig);
      if (res.status >= 200 && res.status < 300) return true;
    } catch {
      // still waking / offline
    }
    await sleep(1500 * (attempt + 1));
  }
  return false;
}

/** Retry wrapper for transient gateway / cold-start failures. */
export async function withRetries<T>(
  fn: () => Promise<T>,
  retries = 2,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      const transient =
        !axios.isAxiosError(error) ||
        !error.response ||
        status === 502 ||
        status === 503 ||
        status === 504;
      if (!transient || attempt === retries) break;
      await sleep(1500 * (attempt + 1));
    }
  }
  throw lastError;
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return 'Server is waking up. Wait a moment and try again.';
    }
    if (!error.response) {
      return 'Cannot reach the server. The API may be waking up — wait 30–60s and try again.';
    }
    const message = (error.response.data as ApiErrorBody | undefined)?.message;
    if (message) return message;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
