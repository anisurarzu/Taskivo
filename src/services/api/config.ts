/**
 * API runtime config.
 * Keep mock on by default until a real backend is available.
 *
 * EXPO_PUBLIC_USE_MOCK_API=false → hit EXPO_PUBLIC_API_URL
 */
export function isMockApi() {
  return process.env.EXPO_PUBLIC_USE_MOCK_API !== 'false';
}

export const API_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_API_URL ?? 'https://taskivo.onrender.com',
  useMock: isMockApi(),
} as const;
