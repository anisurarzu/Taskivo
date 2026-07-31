import { useRouter } from 'expo-router';
import { ProfileEditScreen } from '@/features/auth';

export default function ProfileEditRoute() {
  const router = useRouter();
  return <ProfileEditScreen onBack={() => router.back()} />;
}
