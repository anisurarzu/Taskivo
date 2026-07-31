import { useLocalSearchParams, useRouter } from 'expo-router';
import { TeamDetailScreen } from '@/features/orgs';

export default function TeamRoute() {
  const router = useRouter();
  const { teamId } = useLocalSearchParams<{ teamId: string }>();

  return (
    <TeamDetailScreen
      teamId={String(teamId)}
      onBack={() => router.back()}
      onChat={() => router.push(`/team/${teamId}/chat`)}
      onTaskPress={(id) => router.push(`/task/${id}`)}
      onBudgetPress={(id) => router.push(`/budget/${id}`)}
    />
  );
}
