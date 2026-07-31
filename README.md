# Taskivo (Mobile)

**Organize Your Life Smarter.**

Expo / React Native client for Taskivo. It uses the **same production backend as Taskivo Web** (Express + MongoDB + JWT + Socket.io).

## Source of truth

| Repo | Role |
|------|------|
| [Taskivo](https://github.com/anisurarzu/Taskivo) (this app) | Mobile client |
| [Taskivo-Web](https://github.com/anisurarzu/Taskivo-Web) | Web client + **canonical API** in `server/` |

Do **not** treat the legacy `server/` folder in this repo as the long-term backend. It is deprecated (see `server/README.md`).

## API config

```
EXPO_PUBLIC_API_URL=https://taskivo-api.onrender.com
EXPO_PUBLIC_USE_MOCK_API=false
```

- Production: same URL as web (`NEXT_PUBLIC_API_URL` in Taskivo-Web, typically `https://taskivo-api.onrender.com`)
- Local: `http://localhost:4000` (run `Taskivo-Web/server`)
- Offline mock only when `EXPO_PUBLIC_USE_MOCK_API=true`

```bash
nvm use   # Node 20+
npm install --legacy-peer-deps
npm start
```

Demo: `demo@taskivo.app` / `Taskivo123` / OTP `123456`  
Or tap **Browse demo workspace** (calls `POST /auth/demo`, read-only).

Health: https://taskivo-api.onrender.com/health

## Auth contract

- Header: `Authorization: Bearer <accessToken>`
- Tokens: `tokens.accessToken` / `refreshToken` / `expiresAt`
- Cold start: `GET /health` with backoff before auth
- On 401 (non-public auth routes): session cleared

## Wired today

- Auth (login, register, OTP, reset, demo, refresh)
- Tasks CRUD + toggle (+ tracking endpoints available in API layer)
- Focus sessions
- Notifications (REST + Socket.io `notification:new` / `task:updated`)
- API scaffolds: orgs/teams, budgets, expenses, analytics
- `useTeamRealtime` for future chat/presence screens

## Tech stack

- Expo SDK 54 + React Native + TypeScript
- Expo Router · NativeWind · Zustand · React Query · Axios · Socket.io
