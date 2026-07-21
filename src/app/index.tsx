import { useCallback, useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { SplashScreen } from '@/screens';
import { useAuthStore } from '@/store';
import { Loading } from '@/components/ui';

export default function Index() {
  const { isHydrated, isAuthenticated, hasCompletedOnboarding } = useAuthStore();
  const [showSplash, setShowSplash] = useState(true);

  const finishSplash = useCallback(() => setShowSplash(false), []);

  useEffect(() => {
    if (!isHydrated) return;
  }, [isHydrated]);

  if (!isHydrated || showSplash) {
    if (!isHydrated) {
      return <Loading fullScreen label="Starting Taskivo..." />;
    }
    return <SplashScreen onFinish={finishSplash} />;
  }

  if (!hasCompletedOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
