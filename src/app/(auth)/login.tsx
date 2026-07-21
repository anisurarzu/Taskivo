import { useRouter } from 'expo-router';
import { LoginScreen } from '@/screens';
import { useAuthStore } from '@/store';

export default function LoginRoute() {
  const router = useRouter();
  const signIn = useAuthStore((s) => s.signIn);

  return (
    <LoginScreen
      onLogin={() => {
        signIn();
        router.replace('/(tabs)');
      }}
      onRegister={() => router.push('/(auth)/register')}
      onForgotPassword={() => router.push('/(auth)/forgot-password')}
    />
  );
}
