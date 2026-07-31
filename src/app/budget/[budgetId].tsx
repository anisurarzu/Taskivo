import { useLocalSearchParams, useRouter } from 'expo-router';
import { BudgetDetailScreen } from '@/features/budgets';

export default function BudgetDetailRoute() {
  const router = useRouter();
  const { budgetId } = useLocalSearchParams<{ budgetId: string }>();
  return (
    <BudgetDetailScreen budgetId={String(budgetId)} onBack={() => router.back()} />
  );
}
