import { useRouter } from 'expo-router';
import { AuthRegisterScreen } from '@/features/auth';

export default function RegisterRoute() {
  const router = useRouter();

  return (
    <AuthRegisterScreen
      onSuccess={() => router.push('/(auth)/email-verification')}
      onLogin={() => router.back()}
    />
  );
}
