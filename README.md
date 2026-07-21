# Taskivo

**Organize Your Life Smarter.**

A premium React Native (Expo) productivity app foundation with a clean architecture, modern UI, and dark mode — ready for feature implementation.

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

## Notes

- UI and navigation only — no backend business logic yet.
- Compatible with **Expo Go SDK 54**.
- `react-native-mmkv` needs a custom/dev client; memory fallback is used in Expo Go.
- Mock data lives in `src/data/mock.ts`.
