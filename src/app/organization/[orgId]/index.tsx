import { useLocalSearchParams, useRouter } from 'expo-router';
import { OrganizationDetailScreen } from '@/features/orgs';

export default function OrganizationDetailRoute() {
  const router = useRouter();
  const { orgId } = useLocalSearchParams<{ orgId: string }>();

  return (
    <OrganizationDetailScreen
      orgId={String(orgId)}
      onBack={() => router.back()}
      onTeamPress={(teamId) => router.push(`/team/${teamId}`)}
      onTeamChatPress={(teamId) => router.push(`/team/${teamId}/chat`)}
      onBudgetsPress={() => router.push(`/organization/${orgId}/budgets`)}
    />
  );
}
