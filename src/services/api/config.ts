/**
 * API runtime config.
 *
 * Live Render API is the default.
 * Set EXPO_PUBLIC_USE_MOCK_API=true only for offline mock mode.
 */
export function isMockApi() {
  return process.env.EXPO_PUBLIC_USE_MOCK_API === 'true';
}

export const API_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_API_URL ?? 'https://taskivo.onrender.com',
  useMock: isMockApi(),
} as const;
