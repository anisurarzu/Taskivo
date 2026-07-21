import { useRouter } from 'expo-router';
import { ForgotPasswordScreen } from '@/screens';

export default function ForgotPasswordRoute() {
  const router = useRouter();

  return (
    <ForgotPasswordScreen
      onSubmit={() => router.back()}
      onBack={() => router.back()}
    />
  );
}
