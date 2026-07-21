import { useRouter } from 'expo-router';
import { HomeScreen } from '@/screens';

export default function HomeRoute() {
  const router = useRouter();

  return (
    <HomeScreen
      onSearch={() => router.push('/search')}
      onNotifications={() => router.push('/notifications')}
      onTaskPress={(id) => router.push(`/task/${id}`)}
      onCreateTask={() => router.push('/task/create')}
    />
  );
}
