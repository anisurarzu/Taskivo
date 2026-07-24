import { useLocalSearchParams, useRouter } from 'expo-router';
import { TaskFormScreen } from '@/features/tasks';

export default function EditTaskRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <TaskFormScreen
      mode="edit"
      taskId={id}
      onBack={() => router.back()}
      onSuccess={() => router.back()}
    />
  );
}
