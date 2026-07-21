import { useRouter } from 'expo-router';
import { SearchScreen } from '@/screens';

export default function SearchRoute() {
  const router = useRouter();

  return (
    <SearchScreen
      onBack={() => router.back()}
      onTaskPress={(id) => router.push(`/task/${id}`)}
    />
  );
}
