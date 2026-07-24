import { useRouter } from 'expo-router';
import { TaskFormScreen } from '@/features/tasks';

export default function CreateTaskRoute() {
  const router = useRouter();

  return (
    <TaskFormScreen
      mode="create"
      onBack={() => router.back()}
      onSuccess={(taskId) => router.replace(`/task/${taskId}`)}
    />
  );
}
