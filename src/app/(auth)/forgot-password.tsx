import { useRouter } from 'expo-router';
import { AuthForgotPasswordScreen } from '@/features/auth';

export default function ForgotPasswordRoute() {
  const router = useRouter();

  return (
    <AuthForgotPasswordScreen
      onSuccess={() => router.push('/(auth)/otp-verification')}
      onBack={() => router.back()}
    />
  );
}
