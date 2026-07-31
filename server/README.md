# Deprecated — do not use as source of truth

This `server/` folder was an early **mobile-only** API (SQLite/Postgres).

The canonical backend now lives in **Taskivo-Web**:

- Repo: https://github.com/anisurarzu/Taskivo-Web
- Path: `server/` (Express + MongoDB + JWT + Socket.io)
- Production: `https://taskivo-api.onrender.com`
- Local: `http://localhost:4000`

Point the Expo app at that API via:

```
EXPO_PUBLIC_API_URL=https://taskivo-api.onrender.com
EXPO_PUBLIC_USE_MOCK_API=false
```

Keep this folder only for reference or temporary local experiments. Do not dual-write app data here.
