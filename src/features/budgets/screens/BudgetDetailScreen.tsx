import { useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Screen } from '@/components/common';
import { Card } from '@/components/cards';
import { IconButton, PrimaryButton } from '@/components/buttons';
import { AppTextInput } from '@/components/inputs';
import { EmptyState, Loading } from '@/components/ui';
import { AppModal } from '@/components/modals';
import { formatDate } from '@/utils/format';
import {
  useBudgetQuery,
  useCreateExpenseMutation,
  useExpensesQuery,
} from '../hooks/useBudgets';

interface BudgetDetailScreenProps {
  budgetId: string;
  onBack: () => void;
}

function money(amount: number, currency = 'USD') {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

export function BudgetDetailScreen({ budgetId, onBack }: BudgetDetailScreenProps) {
  const budgetQuery = useBudgetQuery(budgetId);
  const expensesQuery = useExpensesQuery(budgetId);
  const createExpense = useCreateExpenseMutation();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  const budget = budgetQuery.data;
  const expenses = expensesQuery.data ?? [];

  if (budgetQuery.isLoading) {
    return (
      <Screen>
        <Loading fullScreen label="Loading budget…" />
      </Screen>
    );
  }

  if (!budget) {
    return (
      <Screen>
        <EmptyState title="Budget not found" actionLabel="Go back" onAction={onBack} />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Animated.View entering={FadeInDown.duration(320)} className="pt-2">
        <View className="mb-5 flex-row items-center justify-between">
          <IconButton name="chevron-back" onPress={onBack} className="-ml-2" />
          <IconButton name="add" variant="filled" onPress={() => setOpen(true)} />
        </View>

        <Text className="text-2xl font-bold text-ink dark:text-ink-dark">{budget.name}</Text>
        <Text className="mt-1 text-base text-ink-secondary dark:text-ink-dark-secondary">
          {money(budget.spent, budget.currency)} spent of {money(budget.amount, budget.currency)}
        </Text>

        <View className="mt-5 flex-row gap-3">
          <Card className="min-w-0 flex-1 items-center py-3">
            <Text className="text-lg font-bold text-ink dark:text-ink-dark">
              {money(budget.remaining, budget.currency)}
            </Text>
            <Text className="mt-1 text-xs text-ink-muted">Remaining</Text>
          </Card>
          <Card className="min-w-0 flex-1 items-center py-3">
            <Text className="text-lg font-bold text-ink dark:text-ink-dark">
              {budget.expenseCount}
            </Text>
            <Text className="mt-1 text-xs text-ink-muted">Expenses</Text>
          </Card>
        </View>

        <Text className="mb-2 mt-6 text-base font-semibold text-ink dark:text-ink-dark">
          Expenses
        </Text>
        {expenses.length === 0 ? (
          <EmptyState
            title="No expenses"
            description="Log your first expense for this budget."
            actionLabel="Add expense"
            onAction={() => setOpen(true)}
            icon="receipt-outline"
          />
        ) : (
          <Card padded={false}>
            {expenses.map((expense, index) => (
              <View
                key={expense.id}
                className={`px-4 py-3.5 ${
                  index < expenses.length - 1
                    ? 'border-b border-border dark:border-border-dark'
                    : ''
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <Text className="flex-1 text-base font-medium text-ink dark:text-ink-dark">
                    {expense.title}
                  </Text>
                  <Text className="text-base font-semibold text-ink dark:text-ink-dark">
                    {money(expense.amount, expense.currency)}
                  </Text>
                </View>
                <Text className="mt-1 text-xs text-ink-muted">
                  {expense.category} · {formatDate(expense.spentAt)}
                </Text>
              </View>
            ))}
          </Card>
        )}
      </Animated.View>

      <AppModal visible={open} onClose={() => setOpen(false)} title="Add expense">
        <View className="gap-3.5">
          <AppTextInput label="Title" placeholder="Groceries" value={title} onChangeText={setTitle} />
          <AppTextInput
            label="Amount"
            placeholder="42.50"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
          {error ? <Text className="text-sm text-danger">{error}</Text> : null}
          <PrimaryButton
            label="Save expense"
            loading={createExpense.isPending}
            onPress={() => {
              void (async () => {
                const parsed = Number(amount);
                if (!title.trim() || !Number.isFinite(parsed) || parsed <= 0) {
                  setError('Enter a title and valid amount');
                  return;
                }
                setError(null);
                try {
                  await createExpense.mutateAsync({
                    budgetId,
                    title: title.trim(),
                    amount: parsed,
                    currency: budget.currency,
                    category: 'other',
                  });
                  setOpen(false);
                  setTitle('');
                  setAmount('');
                } catch (e) {
                  setError(e instanceof Error ? e.message : 'Could not save expense');
                }
              })();
            }}
          />
        </View>
      </AppModal>
    </Screen>
  );
}
