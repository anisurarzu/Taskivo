import { useRouter } from 'expo-router';
import { OtpVerificationScreen } from '@/features/auth';

export default function OtpVerificationRoute() {
  const router = useRouter();

  return (
    <OtpVerificationScreen
      onResetContinue={() => router.push('/(auth)/reset-password')}
      onAuthenticated={() => router.replace('/(tabs)')}
      onBack={() => router.back()}
    />
  );
}
