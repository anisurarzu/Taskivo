import { Redirect, useRouter } from 'expo-router';
import { ProfileScreen } from '@/screens';
import { useLogoutMutation, useAuthStore } from '@/features/auth';

export default function ProfileRoute() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logoutMutation = useLogoutMutation();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <ProfileScreen
      onSettings={() => router.push('/settings')}
      onSignOut={async () => {
        await logoutMutation.mutateAsync();
        router.replace('/(auth)/login');
      }}
    />
  );
}
