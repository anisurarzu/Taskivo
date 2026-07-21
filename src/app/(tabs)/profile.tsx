import { useRouter } from 'expo-router';
import { ProfileScreen } from '@/screens';
import { useAuthStore } from '@/store';

export default function ProfileRoute() {
  const router = useRouter();
  const signOut = useAuthStore((s) => s.signOut);

  return (
    <ProfileScreen
      onSettings={() => router.push('/settings')}
      onSignOut={() => {
        signOut();
        router.replace('/(auth)/login');
      }}
    />
  );
}
