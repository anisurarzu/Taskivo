# Taskivo

**Organize Your Life Smarter.**

A premium React Native (Expo) productivity app with auth, tasks, focus sessions, analytics, and local reminders.

## Tech stack

- Expo SDK 54 + React Native + TypeScript
- Expo Router (file-based navigation)
- NativeWind (Tailwind CSS)
- Zustand · React Query · React Hook Form · Axios
- Reanimated · Gesture Handler · SVG · MMKV · Secure Store · Notifications

## Getting started

```bash
nvm use
npm install --legacy-peer-deps
npm start
```

Then scan the QR code with **Expo Go (SDK 54)**.

Demo OTP: `123456`

## Environment

Copy `.env.example`:

- `EXPO_PUBLIC_API_URL` — backend base URL
- `EXPO_PUBLIC_USE_MOCK_API=true` — local MMKV mock services (default)

Set `EXPO_PUBLIC_USE_MOCK_API=false` when a real API is ready. Tasks/focus go through repository layers that already swap to Axios.

## Notes

- Compatible with **Expo Go SDK 54**.
- `react-native-mmkv` needs a custom/dev client; memory fallback is used in Expo Go.
- Task due reminders use `expo-notifications` (permission required on device).
