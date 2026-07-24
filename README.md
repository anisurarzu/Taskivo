# Taskivo

**Organize Your Life Smarter.**

A premium React Native (Expo) productivity app with auth, tasks, focus sessions, analytics, and a real JWT API.

## Production steps (current)

1. **P0** Client uses real user/task/focus data on Home (done)
2. **P1** Real API in `server/` — auth, tasks, focus (done)
3. **P2** App wired via `EXPO_PUBLIC_USE_MOCK_API=false` (done)
4. **P3** EAS build profiles in `eas.json` (done)

## Run locally (production API)

App points to live Render API by default:

```
EXPO_PUBLIC_API_URL=https://taskivo.onrender.com
EXPO_PUBLIC_USE_MOCK_API=false
```

```bash
nvm use
npm install --legacy-peer-deps
npm start
```

Demo OTP: `123456`

Health check: https://taskivo.onrender.com/health

### Optional local API

```bash
cd server && npm run dev
# then set EXPO_PUBLIC_API_URL=http://localhost:4000
```

## Next: durable database

Current API uses **SQLite on the Render disk**, which can reset on redeploy/sleep.
Production next step: **Render Postgres** (or similar) so users/tasks persist reliably.

## Tech stack

- Expo SDK 54 + React Native + TypeScript
- Expo Router · NativeWind · Zustand · React Query · RHF · Axios
- API: Express + SQLite + JWT (`server/`)
