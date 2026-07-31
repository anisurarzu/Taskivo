import Constants from 'expo-constants';

/**
 * Shared Taskivo API runtime config (same backend as Taskivo-Web).
 *
 * Production: EXPO_PUBLIC_API_URL=https://taskivo-api.onrender.com
 * Local:      EXPO_PUBLIC_API_URL=http://localhost:4000  (run Taskivo-Web/server)
 * Mock:       EXPO_PUBLIC_USE_MOCK_API=true  (offline only)
 *
 * Note: https://taskivo.onrender.com is the OLD mobile-only SQLite API — do not use.
 */
const SHARED_API = 'https://taskivo-api.onrender.com';
const LEGACY_API = 'https://taskivo.onrender.com';

function resolveApiUrl(raw: string | undefined): string {
  if (!raw || raw === LEGACY_API) return SHARED_API;
  return raw;
}

export function isMockApi() {
  const fromExtra = Constants.expoConfig?.extra?.useMockApi;
  const flag = process.env.EXPO_PUBLIC_USE_MOCK_API ?? String(fromExtra ?? 'false');
  return flag === 'true';
}

export const API_CONFIG = {
  baseUrl: resolveApiUrl(
    process.env.EXPO_PUBLIC_API_URL ??
      (Constants.expoConfig?.extra?.apiUrl as string | undefined),
  ),
  useMock: isMockApi(),
} as const;
