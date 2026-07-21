import { type ReactNode } from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/features/auth';
import { Loading } from '@/components/ui';

export function PublicRoute({ children }: { children: ReactNode }) {
  const { isHydrated, isAuthenticated } = useAuthStore();

  if (!isHydrated) {
    return <Loading fullScreen label="Loading..." />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <>{children}</>;
}
