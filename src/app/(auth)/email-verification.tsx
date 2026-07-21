import { useRouter } from 'expo-router';
import { EmailVerificationScreen } from '@/features/auth';

export default function EmailVerificationRoute() {
  const router = useRouter();

  return (
    <EmailVerificationScreen
      onContinue={() => router.push('/(auth)/otp-verification')}
      onBack={() => router.replace('/(auth)/login')}
    />
  );
}
