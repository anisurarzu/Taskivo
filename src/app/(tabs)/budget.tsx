import { useRouter } from 'expo-router';
import { BudgetsScreen } from '@/features/budgets';

export default function BudgetTab() {
  const router = useRouter();
  return (
    <BudgetsScreen onBudgetPress={(id) => router.push(`/budget/${id}`)} />
  );
}
