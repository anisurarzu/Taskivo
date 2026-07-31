import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/common';
import { Card } from '@/components/cards';
import { IconButton, PrimaryButton } from '@/components/buttons';
import { AppTextInput } from '@/components/inputs';
import { BudgetCardSkeleton, EmptyState } from '@/components/ui';
import { AppModal } from '@/components/modals';
import { colors } from '@/theme/colors';
import { useCreateOrgBudgetMutation, useOrgBudgetsQuery } from '@/features/budgets';
import { useOrganizationQuery } from '../hooks/useOrgs';

interface OrgBudgetsScreenProps {
  orgId: string;
  onBack: () => void;
  onBudgetPress: (budgetId: string) => void;
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

export function OrgBudgetsScreen({ orgId, onBack, onBudgetPress }: OrgBudgetsScreenProps) {
  const orgQuery = useOrganizationQuery(orgId);
  const budgetsQuery = useOrgBudgetsQuery(orgId);
  const createBudget = useCreateOrgBudgetMutation(orgId);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  const budgets = budgetsQuery.data ?? [];

  return (
    <Screen scroll>
      <Animated.View entering={FadeInDown.duration(280)} className="pt-1">
        <View className="mb-5 flex-row items-center justify-between">
          <IconButton name="chevron-back" onPress={onBack} size={22} className="-ml-1" />
          <IconButton name="add" variant="filled" size={22} onPress={() => setOpen(true)} />
        </View>

        <Text className="text-[28px] font-bold leading-8 tracking-tight text-ink dark:text-ink-dark">
          {orgQuery.data?.name ?? 'Organization'} budgets
        </Text>
        <Text className="mt-2 text-[16px] leading-6 text-ink-secondary dark:text-ink-dark-secondary">
          Org funds and team allocations
        </Text>

        {budgetsQuery.isLoading ? (
          <View className="mt-6">
            <BudgetCardSkeleton />
            <BudgetCardSkeleton />
            <BudgetCardSkeleton />
          </View>
        ) : null}

        {!budgetsQuery.isLoading && budgets.length === 0 ? (
          <View className="mt-6">
            <EmptyState
              title="No org budgets"
              description="Create an organization fund to allocate money to teams."
              actionLabel="Create fund"
              onAction={() => setOpen(true)}
              icon="wallet-outline"
            />
          </View>
        ) : null}

        {!budgetsQuery.isLoading ? (
          <View className="mt-6 gap-3">
            {budgets.map((budget) => {
              const pct =
                budget.amount > 0
                  ? Math.min(100, Math.round((budget.spent / budget.amount) * 100))
                  : 0;
              return (
                <Pressable key={budget.id} onPress={() => onBudgetPress(budget.id)}>
                  <Card className="p-4">
                    <View className="flex-row items-center">
                      <View className="mr-3.5 h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <Ionicons name="wallet-outline" size={22} color={colors.primary} />
                      </View>
                      <View className="min-w-0 flex-1">
                        <Text className="text-[17px] font-semibold text-ink dark:text-ink-dark">
                          {budget.name}
                        </Text>
                        <Text className="mt-0.5 text-[14px] text-ink-secondary dark:text-ink-dark-secondary">
                          {money(budget.spent, budget.currency)} /{' '}
                          {money(budget.amount, budget.currency)}
                          {budget.kind ? ` · ${budget.kind}` : ''}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                    </View>
                    <View className="mt-3.5">
                      <View className="mb-1.5 flex-row justify-between">
                        <Text className="text-[13px] text-ink-muted">Spent</Text>
                        <Text className="text-[13px] font-bold text-ink dark:text-ink-dark">
                          {pct}%
                        </Text>
                      </View>
                      <View className="h-2.5 overflow-hidden rounded-full bg-surface-elevated dark:bg-surface-elevated-dark">
                        <View
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${Math.max(pct, pct > 0 ? 3 : 0)}%` }}
                        />
                      </View>
                      <Text className="mt-2 text-[13px] text-ink-secondary dark:text-ink-dark-secondary">
                        Remaining{' '}
                        {money(
                          budget.remaining ?? budget.amount - budget.spent,
                          budget.currency,
                        )}
                      </Text>
                    </View>
                  </Card>
                </Pressable>
              );
            })}
          </View>
        ) : null}
      </Animated.View>

      <AppModal visible={open} onClose={() => setOpen(false)} title="New org fund">
        <View className="gap-4">
          <AppTextInput
            size="lg"
            label="Name"
            placeholder="Q3 product fund"
            value={name}
            onChangeText={setName}
          />
          <AppTextInput
            size="lg"
            label="Amount"
            placeholder="5000"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
          {error ? <Text className="text-[14px] text-danger">{error}</Text> : null}
          <PrimaryButton
            size="lg"
            label="Create"
            loading={createBudget.isPending}
            onPress={() => {
              void (async () => {
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
                    teamId: null,
                  });
                  setOpen(false);
                  setName('');
                  setAmount('');
                  onBudgetPress(budget.id);
                } catch (e) {
                  setError(e instanceof Error ? e.message : 'Could not create budget');
                }
              })();
            }}
          />
        </View>
      </AppModal>
    </Screen>
  );
}
