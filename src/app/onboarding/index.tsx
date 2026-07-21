import { useRouter } from 'expo-router';
import { AuthOnboardingScreen, useAuthStore } from '@/features/auth';

export default function OnboardingRoute() {
  const router = useRouter();
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);

  const finish = () => {
    completeOnboarding();
    router.replace('/(auth)/login');
  };

  return <AuthOnboardingScreen onComplete={finish} onSkip={finish} />;
}
