import { useRouter } from 'expo-router';
import { CreateTaskScreen } from '@/screens';

export default function CreateTaskRoute() {
  const router = useRouter();

  return (
    <CreateTaskScreen
      onBack={() => router.back()}
      onSubmit={() => router.back()}
    />
  );
}
