/**
 * Expo config with production API defaults baked in.
 * .env can still override at build/start time.
 */
const appJson = require('./app.json');

module.exports = () => {
  const expo = appJson.expo;
  return {
    ...expo,
    extra: {
      ...(expo.extra ?? {}),
      apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'https://taskivo.onrender.com',
      useMockApi: process.env.EXPO_PUBLIC_USE_MOCK_API ?? 'false',
    },
  };
};
