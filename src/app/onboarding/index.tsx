import { useRouter } from 'expo-router';
import { OnboardingScreen } from '@/screens';
import { useAuthStore } from '@/store';

export default function OnboardingRoute() {
  const router = useRouter();
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);

  return (
    <OnboardingScreen
      onComplete={() => {
        completeOnboarding();
        router.replace('/(auth)/login');
      }}
      onSkip={() => {
        completeOnboarding();
        router.replace('/(auth)/login');
      }}
    />
  );
}
