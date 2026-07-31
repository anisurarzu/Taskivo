/**
 * Expo config — shared Taskivo-Web API (not the legacy mobile SQLite server).
 * .env can still override at start time.
 */
const appJson = require('./app.json');

const SHARED_API = 'https://taskivo-api.onrender.com';
const LEGACY_API = 'https://taskivo.onrender.com';

function resolveApiUrl(raw) {
  if (!raw || raw === LEGACY_API) return SHARED_API;
  return raw;
}

module.exports = () => {
  const expo = appJson.expo;
  const apiUrl = resolveApiUrl(process.env.EXPO_PUBLIC_API_URL);
  return {
    ...expo,
    extra: {
      ...(expo.extra ?? {}),
      apiUrl,
      useMockApi: process.env.EXPO_PUBLIC_USE_MOCK_API ?? 'false',
    },
  };
};
