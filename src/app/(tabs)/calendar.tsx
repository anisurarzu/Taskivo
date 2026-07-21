import { useRouter } from 'expo-router';
import { CalendarScreen } from '@/screens';

export default function CalendarRoute() {
  const router = useRouter();

  return <CalendarScreen onTaskPress={(id) => router.push(`/task/${id}`)} />;
}
