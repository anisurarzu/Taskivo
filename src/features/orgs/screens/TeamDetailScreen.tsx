import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/common';
import { Card, TaskCard } from '@/components/cards';
import { IconButton, PrimaryButton, SecondaryButton } from '@/components/buttons';
import { AppTextInput } from '@/components/inputs';
import {
  Avatar,
  BudgetCardSkeleton,
  DetailScreenSkeleton,
  EmptyState,
  TaskSkeleton,
} from '@/components/ui';
import { AppModal } from '@/components/modals';
import { colors } from '@/theme/colors';
import { useCreateTaskMutation, useTasksQuery } from '@/features/tasks';
import { useOrgBudgetsQuery } from '@/features/budgets';
import { useTeamMembersQuery, useTeamQuery } from '../hooks/useOrgs';

interface TeamDetailScreenProps {
  teamId: string;
  orgId?: string;
  onBack: () => void;
  onChat: () => void;
  onTaskPress: (taskId: string) => void;
  onBudgetPress?: (budgetId: string) => void;
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

export function TeamDetailScreen({
  teamId,
  orgId: orgIdProp,
  onBack,
  onChat,
  onTaskPress,
  onBudgetPress,
}: TeamDetailScreenProps) {
  const teamQuery = useTeamQuery(teamId);
  const membersQuery = useTeamMembersQuery(teamId);
  const tasksQuery = useTasksQuery({ teamId });
  const orgId = orgIdProp ?? teamQuery.data?.organizationId;
  const budgetsQuery = useOrgBudgetsQuery(orgId, teamId);
  const createTask = useCreateTaskMutation();

  const [assignOpen, setAssignOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budgetId, setBudgetId] = useState<string | null>(null);
  const [budgetAmount, setBudgetAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  const team = teamQuery.data;
  const members = membersQuery.data ?? [];
  const tasks = tasksQuery.data ?? [];
  const budgets = budgetsQuery.data ?? [];

  const budgetById = useMemo(() => {
    const map = new Map(budgets.map((b) => [b.id, b]));
    return map;
  }, [budgets]);

  const completedCount = tasks.filter((t) => t.isCompleted || t.status === 'completed').length;
  const progressPct =
    tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);
  const budgetSpent = budgets.reduce((sum, b) => sum + (b.spent ?? 0), 0);
  const budgetTotal = budgets.reduce((sum, b) => sum + (b.amount ?? 0), 0);

  if (teamQuery.isLoading) {
    return (
      <Screen scroll>
        <DetailScreenSkeleton rows={5} />
      </Screen>
    );
  }

  if (!team) {
    return (
      <Screen>
        <EmptyState title="Team not found" actionLabel="Go back" onAction={onBack} />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Animated.View entering={FadeInDown.duration(280)} className="pt-1">
        <View className="mb-5 flex-row items-center justify-between">
          <IconButton name="chevron-back" onPress={onBack} size={22} className="-ml-1" />
          <View className="flex-row gap-2">
            <IconButton name="chatbubbles-outline" variant="soft" size={20} onPress={onChat} />
            <IconButton name="add" variant="filled" size={22} onPress={() => setAssignOpen(true)} />
          </View>
        </View>

        <Text className="text-[28px] font-bold leading-8 tracking-tight text-ink dark:text-ink-dark">
          {team.name}
        </Text>
        <Text className="mt-2 text-[16px] leading-6 text-ink-secondary dark:text-ink-dark-secondary">
          {team.description?.trim() || 'Team tasks, budgets, and members'}
        </Text>

        {/* Overview */}
        <View className="mt-5 rounded-xl border border-border/80 bg-card p-4 dark:border-border-dark dark:bg-card-dark">
          <View className="mb-3 flex-row items-end justify-between">
            <View>
              <Text className="text-[14px] font-semibold text-ink-secondary dark:text-ink-dark-secondary">
                Task progress
              </Text>
              <Text className="mt-1 text-[28px] font-bold text-ink dark:text-ink-dark">
                {progressPct}%
              </Text>
              <Text className="mt-0.5 text-[14px] text-ink-muted">
                {completedCount} of {tasks.length} complete
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-[14px] font-semibold text-ink-secondary dark:text-ink-dark-secondary">
                Budgets
              </Text>
              <Text className="mt-1 text-[17px] font-bold text-ink dark:text-ink-dark">
                {budgets.length === 0
                  ? '—'
                  : `${money(budgetSpent)} / ${money(budgetTotal)}`}
              </Text>
            </View>
          </View>
          <View className="h-2.5 overflow-hidden rounded-full bg-surface-elevated dark:bg-surface-elevated-dark">
            <View
              className="h-full rounded-full bg-primary"
              style={{ width: `${Math.max(progressPct, progressPct > 0 ? 3 : 0)}%` }}
            />
          </View>
        </View>

        <View className="mt-4 flex-row gap-3">
          <Pressable
            onPress={onChat}
            className="min-w-0 flex-1 flex-row items-center justify-center rounded-xl bg-primary py-4"
          >
            <Ionicons name="chatbubbles" size={20} color="#FFFFFF" />
            <Text className="ml-2 text-[16px] font-semibold text-white">Open chat</Text>
          </Pressable>
          <Pressable
            onPress={() => setAssignOpen(true)}
            className="min-w-0 flex-1 flex-row items-center justify-center rounded-xl border border-border bg-card py-4 dark:border-border-dark dark:bg-card-dark"
          >
            <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
            <Text className="ml-2 text-[16px] font-semibold text-ink dark:text-ink-dark">
              Assign
            </Text>
          </Pressable>
        </View>

        <View className="mb-3 mt-8 flex-row items-center justify-between">
          <Text className="text-[19px] font-bold text-ink dark:text-ink-dark">Team tasks</Text>
          <Text className="text-[15px] font-medium text-ink-muted">{tasks.length}</Text>
        </View>

        {tasksQuery.isLoading ? (
          <View>
            <TaskSkeleton />
            <TaskSkeleton />
            <TaskSkeleton />
          </View>
        ) : null}

        {!tasksQuery.isLoading && tasks.length === 0 ? (
          <EmptyState
            title="No team tasks yet"
            description="Assign work to this team — same as the web team page."
            actionLabel="Assign task"
            onAction={() => setAssignOpen(true)}
            icon="checkbox-outline"
          />
        ) : null}

        {!tasksQuery.isLoading
          ? tasks.map((task) => {
              const linked = task.budgetId ? budgetById.get(task.budgetId) : undefined;
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  detailed
                  budgetLabel={linked?.name}
                  onPress={() => onTaskPress(task.id)}
                />
              );
            })
          : null}

        <View className="mb-3 mt-7 flex-row items-center justify-between">
          <Text className="text-[19px] font-bold text-ink dark:text-ink-dark">Budgets</Text>
          <Text className="text-[15px] font-medium text-ink-muted">{budgets.length}</Text>
        </View>

        {budgetsQuery.isLoading ? (
          <View>
            <BudgetCardSkeleton />
            <BudgetCardSkeleton />
          </View>
        ) : null}

        {!budgetsQuery.isLoading && budgets.length === 0 ? (
          <Card className="py-5">
            <Text className="text-[15px] leading-6 text-ink-secondary dark:text-ink-dark-secondary">
              No team budgets yet. Create funds from Organization → Budgets, then link them here
              when assigning tasks.
            </Text>
          </Card>
        ) : null}

        {!budgetsQuery.isLoading ? (
          <View className="gap-3">
            {budgets.map((budget) => {
              const pct =
                budget.amount > 0
                  ? Math.min(100, Math.round((budget.spent / budget.amount) * 100))
                  : 0;
              return (
                <Pressable key={budget.id} onPress={() => onBudgetPress?.(budget.id)}>
                  <Card padded={false} className="p-4">
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
                        Remaining {money(budget.remaining ?? budget.amount - budget.spent, budget.currency)}
                      </Text>
                    </View>
                  </Card>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        <Text className="mb-3 mt-7 text-[19px] font-bold text-ink dark:text-ink-dark">
          Members
        </Text>
        <Card padded={false}>
          {members.length === 0 ? (
            <View className="px-4 py-5">
              <Text className="text-[15px] text-ink-secondary dark:text-ink-dark-secondary">
                No members listed yet.
              </Text>
            </View>
          ) : (
            members.map((member, index) => (
              <View
                key={member.id}
                className={`flex-row items-center px-4 py-3.5 ${
                  index < members.length - 1
                    ? 'border-b border-border dark:border-border-dark'
                    : ''
                }`}
              >
                <Avatar name={member.user.name} uri={member.user.avatarUrl} size="md" />
                <View className="ml-3.5 min-w-0 flex-1">
                  <Text className="text-[16px] font-semibold text-ink dark:text-ink-dark">
                    {member.user.name}
                  </Text>
                  <Text className="mt-0.5 text-[14px] text-ink-secondary dark:text-ink-dark-secondary">
                    {member.roleLabel ?? member.role}
                  </Text>
                </View>
              </View>
            ))
          )}
        </Card>
      </Animated.View>

      <AppModal visible={assignOpen} onClose={() => setAssignOpen(false)} title="Assign task">
        <View className="gap-4">
          <AppTextInput
            size="lg"
            label="Title"
            placeholder="Ship onboarding emails"
            value={title}
            onChangeText={setTitle}
          />
          <AppTextInput
            size="lg"
            label="Details"
            placeholder="What should get done?"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          {budgets.length > 0 ? (
            <View>
              <Text className="mb-2 text-[14px] font-semibold text-ink dark:text-ink-dark">
                Link budget (optional)
              </Text>
              <View className="flex-row flex-wrap gap-2">
                <Pressable
                  onPress={() => setBudgetId(null)}
                  className={`rounded-full px-3.5 py-2 ${
                    budgetId === null ? 'bg-primary' : 'bg-surface-elevated dark:bg-surface-elevated-dark'
                  }`}
                >
                  <Text
                    className={`text-[13px] font-semibold ${
                      budgetId === null ? 'text-white' : 'text-ink dark:text-ink-dark'
                    }`}
                  >
                    None
                  </Text>
                </Pressable>
                {budgets.map((b) => (
                  <Pressable
                    key={b.id}
                    onPress={() => setBudgetId(b.id)}
                    className={`rounded-full px-3.5 py-2 ${
                      budgetId === b.id
                        ? 'bg-primary'
                        : 'bg-surface-elevated dark:bg-surface-elevated-dark'
                    }`}
                  >
                    <Text
                      className={`text-[13px] font-semibold ${
                        budgetId === b.id ? 'text-white' : 'text-ink dark:text-ink-dark'
                      }`}
                    >
                      {b.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
              {budgetId ? (
                <AppTextInput
                  size="lg"
                  label="Allocate amount"
                  placeholder="250"
                  keyboardType="decimal-pad"
                  value={budgetAmount}
                  onChangeText={setBudgetAmount}
                  containerClassName="mt-3"
                />
              ) : null}
            </View>
          ) : null}

          {error ? <Text className="text-[14px] text-danger">{error}</Text> : null}
          <PrimaryButton
            size="lg"
            label="Create task"
            loading={createTask.isPending}
            onPress={() => {
              void (async () => {
                if (!title.trim()) {
                  setError('Title is required');
                  return;
                }
                if (!orgId) {
                  setError('Missing organization');
                  return;
                }
                const allocated = budgetAmount.trim() ? Number(budgetAmount) : undefined;
                if (
                  budgetId &&
                  budgetAmount.trim() &&
                  (!Number.isFinite(allocated) || (allocated ?? 0) < 0)
                ) {
                  setError('Enter a valid budget amount');
                  return;
                }
                setError(null);
                try {
                  const task = await createTask.mutateAsync({
                    title: title.trim(),
                    description: description.trim() || undefined,
                    organizationId: orgId,
                    teamId,
                    status: 'todo',
                    category: 'work',
                    budgetId: budgetId,
                    budgetAllocated: allocated,
                  });
                  setAssignOpen(false);
                  setTitle('');
                  setDescription('');
                  setBudgetId(null);
                  setBudgetAmount('');
                  onTaskPress(task.id);
                } catch (e) {
                  setError(e instanceof Error ? e.message : 'Could not create task');
                }
              })();
            }}
          />
          <SecondaryButton size="lg" label="Cancel" onPress={() => setAssignOpen(false)} />
        </View>
      </AppModal>
    </Screen>
  );
}
