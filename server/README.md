# Taskivo API

JWT API with **Postgres (production)** or **SQLite (local fallback)**.

## Run locally (SQLite — no Postgres needed)

```bash
cd server
npm install
npm run dev
```

API: `http://localhost:4000`

## Run with Postgres

```bash
export DATABASE_URL=postgres://USER:PASS@HOST:5432/taskivo
npm run dev
```

When `DATABASE_URL` is set, the API uses Postgres automatically.

## Render setup (step by step)

1. Render Dashboard → **New** → **PostgreSQL** (Free)
   - Name: `taskivo-db`
2. Open your **taskivo** Web Service → **Environment**
3. Add:
   - `DATABASE_URL` = Internal Database URL from the Postgres service  
     (or link DB in Render UI so it injects automatically)
4. Keep existing:
   - `JWT_SECRET=...`
   - `DEMO_OTP=123456`
5. **Manual Deploy** latest commit

After deploy, check:
- https://taskivo.onrender.com/health  
  → should include `"database":"postgres"`

Demo login (auto-seeded):
- Email: `demo@taskivo.app`
- Password: `Taskivo123`

## Endpoints

- `POST /auth/register|login|forgot-password|verify-otp|reset-password|logout`
- `GET /auth/me`
- `GET|POST /tasks`, `GET|PATCH|DELETE /tasks/:id`, `POST /tasks/:id/toggle`
- `GET|POST|DELETE /focus/sessions`
