import { Redirect, useRouter } from 'expo-router';
import { AuthLoginScreen, useAuthStore } from '@/features/auth';

export default function LoginRoute() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <AuthLoginScreen
      onSuccess={() => router.replace('/(tabs)')}
      onRegister={() => router.push('/(auth)/register')}
      onForgotPassword={() => router.push('/(auth)/forgot-password')}
    />
  );
}
