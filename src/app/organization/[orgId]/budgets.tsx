import { useLocalSearchParams, useRouter } from 'expo-router';
import { OrgBudgetsScreen } from '@/features/orgs';

export default function OrgBudgetsRoute() {
  const router = useRouter();
  const { orgId } = useLocalSearchParams<{ orgId: string }>();

  return (
    <OrgBudgetsScreen
      orgId={String(orgId)}
      onBack={() => router.back()}
      onBudgetPress={(budgetId) => router.push(`/budget/${budgetId}`)}
    />
  );
}
