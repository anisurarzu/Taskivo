import { useRouter } from 'expo-router';
import { SettingsScreen } from '@/screens';

export default function SettingsRoute() {
  const router = useRouter();
  return <SettingsScreen onBack={() => router.back()} />;
}
