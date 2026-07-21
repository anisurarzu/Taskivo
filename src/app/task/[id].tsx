import { useLocalSearchParams, useRouter } from 'expo-router';
import { TaskDetailsScreen } from '@/screens';

export default function TaskDetailsRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <TaskDetailsScreen
      taskId={id ?? '1'}
      onBack={() => router.back()}
      onEdit={() => router.push('/task/create')}
    />
  );
}
