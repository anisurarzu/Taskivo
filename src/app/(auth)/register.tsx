import { useRouter } from 'expo-router';
import { RegisterScreen } from '@/screens';
import { useAuthStore } from '@/store';

export default function RegisterRoute() {
  const router = useRouter();
  const signIn = useAuthStore((s) => s.signIn);

  return (
    <RegisterScreen
      onRegister={() => {
        signIn();
        router.replace('/(tabs)');
      }}
      onLogin={() => router.back()}
    />
  );
}
