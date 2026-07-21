import { Stack } from 'expo-router';
import { PublicRoute } from '@/features/auth/components/PublicRoute';

export default function AuthLayout() {
  return (
    <PublicRoute>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="email-verification" />
        <Stack.Screen name="otp-verification" />
        <Stack.Screen name="reset-password" />
      </Stack>
    </PublicRoute>
  );
}
