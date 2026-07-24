# Taskivo

**Organize Your Life Smarter.**

A premium React Native (Expo) productivity app with auth, tasks, focus sessions, analytics, and a real JWT API.

## Production steps (current)

1. **P0** Client uses real user/task/focus data on Home (done)
2. **P1** Real API in `server/` — auth, tasks, focus (done)
3. **P2** App wired via `EXPO_PUBLIC_USE_MOCK_API=false` (done)
4. **P3** EAS build profiles in `eas.json` (done)

## Run locally (production-like)

Terminal 1 — API:

```bash
cd server
npm install
npm run dev
```

Terminal 2 — app:

```bash
# root .env should contain:
# EXPO_PUBLIC_API_URL=http://localhost:4000
# EXPO_PUBLIC_USE_MOCK_API=false

nvm use
npm install --legacy-peer-deps
npm start
```

Demo OTP: `123456`

Physical device: set `EXPO_PUBLIC_API_URL` to your computer LAN IP (not localhost).

## Mock mode

Set `EXPO_PUBLIC_USE_MOCK_API=true` to use local MMKV services without the server.

## Tech stack

- Expo SDK 54 + React Native + TypeScript
- Expo Router · NativeWind · Zustand · React Query · RHF · Axios
- API: Express + SQLite + JWT (`server/`)
