# Taskivo API

JWT + SQLite backend for the Expo app.

## Run

```bash
cd server
npm install
npm run dev
```

API: `http://localhost:4000`  
Health: `GET /health`  
Demo OTP: `123456`

## App wiring

In project root `.env`:

```
EXPO_PUBLIC_API_URL=http://localhost:4000
EXPO_PUBLIC_USE_MOCK_API=false
```

For a physical phone, use your computer LAN IP instead of `localhost`.

## Endpoints

- `POST /auth/register|login|forgot-password|verify-otp|reset-password|logout`
- `GET /auth/me`
- `GET|POST /tasks`, `GET|PATCH|DELETE /tasks/:id`, `POST /tasks/:id/toggle`
- `GET|POST|DELETE /focus/sessions`
