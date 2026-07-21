import { useRouter } from 'expo-router';
import { ResetPasswordScreen } from '@/features/auth';

export default function ResetPasswordRoute() {
  const router = useRouter();

  return (
    <ResetPasswordScreen
      onSuccess={() => router.replace('/(tabs)')}
      onBack={() => router.back()}
    />
  );
}
