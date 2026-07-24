import { useLocalSearchParams, useRouter } from 'expo-router';
import { TaskDetailsScreen } from '@/features/tasks';

export default function TaskDetailsRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <TaskDetailsScreen
      taskId={id ?? ''}
      onBack={() => router.back()}
      onEdit={() => router.push(`/task/${id}/edit`)}
      onDeleted={() => router.replace('/(tabs)')}
    />
  );
}
