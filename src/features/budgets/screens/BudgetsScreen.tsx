import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/common';
import { Card } from '@/components/cards';
import { IconButton, PrimaryButton } from '@/components/buttons';
import { AppTextInput } from '@/components/inputs';
import { EmptyState, Loading } from '@/components/ui';
import { AppModal } from '@/components/modals';
import { colors } from '@/theme/colors';
import { useBudgetsQuery, useCreateBudgetMutation } from '../hooks/useBudgets';

interface BudgetsScreenProps {
  onBudgetPress: (id: string) => void;
}

function money(amount: number, currency = 'USD') {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

export function BudgetsScreen({ onBudgetPress }: BudgetsScreenProps) {
  const { data: budgets = [], isLoading, isError, refetch } = useBudgetsQuery();
  const createBudget = useCreateBudgetMutation();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onCreate = async () => {
    const parsed = Number(amount);
    if (!name.trim() || !Number.isFinite(parsed) || parsed <= 0) {
      setError('Enter a name and valid amount');
      return;
    }
    setError(null);
    try {
      const budget = await createBudget.mutateAsync({
        name: name.trim(),
        amount: parsed,
        currency: 'USD',
      });
      setOpen(false);
      setName('');
      setAmount('');
      onBudgetPress(budget.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create budget');
    }
  };

  return (
    <Screen scroll tabBar>
      <Animated.View entering={FadeInDown.duration(320)} className="pt-2">
        <View className="mb-5 flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-ink dark:text-ink-dark">Budgets</Text>
            <Text className="mt-1 text-sm text-ink-secondary dark:text-ink-dark-secondary">
              Track spending and allocations
            </Text>
          </View>
          <IconButton name="add" variant="filled" onPress={() => setOpen(true)} />
        </View>

        {isLoading ? <Loading label="Loading budgets…" /> : null}
        {isError ? (
          <EmptyState
            title="Couldn’t load budgets"
            actionLabel="Retry"
            onAction={() => void refetch()}
            icon="alert-circle-outline"
          />
        ) : null}
        {!isLoading && !isError && budgets.length === 0 ? (
          <EmptyState
            title="No budgets yet"
            description="Create a personal budget to start logging expenses."
            actionLabel="Create budget"
            onAction={() => setOpen(true)}
            icon="wallet-outline"
          />
        ) : null}

        <View className="gap-3">
          {budgets.map((budget) => {
            const pct =
              budget.amount > 0
                ? Math.min(100, Math.round((budget.spent / budget.amount) * 100))
                : 0;
            return (
              <Pressable key={budget.id} onPress={() => onBudgetPress(budget.id)}>
                <Card>
                  <View className="mb-2 flex-row items-start justify-between">
                    <View className="mr-3 min-w-0 flex-1">
                      <Text className="text-base font-semibold text-ink dark:text-ink-dark">
                        {budget.name}
                      </Text>
                      <Text className="mt-0.5 text-sm text-ink-secondary dark:text-ink-dark-secondary">
                        {money(budget.spent, budget.currency)} of{' '}
                        {money(budget.amount, budget.currency)}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                  </View>
                  <View className="h-2 overflow-hidden rounded-full bg-surface-elevated dark:bg-surface-elevated-dark">
                    <View
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${pct}%` }}
                    />
                  </View>
                  <Text className="mt-2 text-xs text-ink-muted">
                    {money(budget.remaining, budget.currency)} remaining · {budget.expenseCount}{' '}
                    expenses
                  </Text>
                </Card>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>

      <AppModal visible={open} onClose={() => setOpen(false)} title="New budget">
        <View className="gap-3.5">
          <AppTextInput label="Name" placeholder="Monthly living" value={name} onChangeText={setName} />
          <AppTextInput
            label="Amount"
            placeholder="1000"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
          {error ? <Text className="text-sm text-danger">{error}</Text> : null}
          <PrimaryButton
            label="Create"
            loading={createBudget.isPending}
            onPress={() => void onCreate()}
          />
        </View>
      </AppModal>
    </Screen>
  );
}
