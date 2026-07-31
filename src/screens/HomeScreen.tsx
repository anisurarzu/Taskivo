import { useMemo } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '@/components/buttons';
import { Screen } from '@/components/common';
import { TaskCard } from '@/components/cards';
import { SearchInput } from '@/components/inputs';
import { Avatar, SectionHeader, EmptyState, TaskSkeleton } from '@/components/ui';
import { formatDate, getGreeting } from '@/utils/format';
import { colors } from '@/theme/colors';
import { useAuthStore } from '@/features/auth';
import { useAnalytics } from '@/features/analytics';
import {
  formatFocusDuration,
  getFocusSecondsThisWeek,
  useFocusSessionsQuery,
} from '@/features/focus';
import {
  getActiveTasks,
  getTaskProgress,
  getTodayTasks,
  getUpcomingTasks,
  useTasksQuery,
  useToggleTaskMutation,
} from '@/features/tasks';

interface HomeScreenProps {
  onSearch: () => void;
  onNotifications: () => void;
  onTaskPress: (id: string) => void;
  onCreateTask: () => void;
  onFocus?: () => void;
  onCalendar?: () => void;
  onOrganizations?: () => void;
  onBudgets?: () => void;
}

export function HomeScreen({
  onSearch,
  onNotifications,
  onTaskPress,
  onCreateTask,
  onFocus,
  onCalendar,
  onOrganizations,
  onBudgets,
}: HomeScreenProps) {
  const { width } = useWindowDimensions();
  const isCompact = width < 380;
  const user = useAuthStore((s) => s.user);
  const { data: tasks = [], isLoading, isError, refetch } = useTasksQuery();
  const { data: sessions = [] } = useFocusSessionsQuery();
  const { streak } = useAnalytics();
  const toggleTask = useToggleTaskMutation();

  const displayName = user?.name?.trim() || user?.email?.split('@')[0] || 'there';
  const firstName = displayName.split(' ')[0] ?? displayName;

  const todayTasks = useMemo(() => {
    const dueToday = getTodayTasks(tasks);
    if (dueToday.length > 0) return dueToday.slice(0, 5);
    return getActiveTasks(tasks).slice(0, 5);
  }, [tasks]);

  const upcoming = useMemo(() => getUpcomingTasks(tasks).slice(0, 3), [tasks]);
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const progress = getTaskProgress(tasks);
  const weekFocusSeconds = getFocusSecondsThisWeek(sessions);

  return (
    <Screen scroll tabBar padded={false}>
      {/* Top bar — white like Facebook header */}
      <Animated.View
        entering={FadeInDown.duration(240)}
        className="border-b border-border/70 bg-card px-5 pb-3.5 pt-1 dark:border-border-dark dark:bg-card-dark"
      >
        <View className="mb-3 flex-row items-center justify-between">
          <View className="min-w-0 flex-1 flex-row items-center pr-3">
            <Avatar name={displayName} uri={user?.avatarUrl} size="md" />
            <View className="ml-2.5 min-w-0 flex-1">
              <Text className="text-[12px] font-medium text-ink-secondary dark:text-ink-dark-secondary">
                {getGreeting()} · {formatDate(new Date())}
              </Text>
              <Text
                numberOfLines={1}
                className="text-[20px] font-bold tracking-tight text-ink dark:text-ink-dark"
              >
                {firstName}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <IconButton name="notifications-outline" variant="soft" onPress={onNotifications} />
            <IconButton name="add" variant="filled" onPress={onCreateTask} />
          </View>
        </View>

        <Pressable onPress={onSearch}>
          <View pointerEvents="none">
            <SearchInput editable={false} placeholder="Search Taskivo" />
          </View>
        </Pressable>
      </Animated.View>

      <View className="px-5 pt-4">
        {/* Momentum card */}
        <Animated.View entering={FadeInUp.delay(40).duration(280)}>
          <View className="overflow-hidden rounded-xl border border-border/80 bg-card p-4 shadow-soft dark:border-border-dark dark:bg-card-dark">
            <View className="mb-3 flex-row items-start justify-between">
              <View className="mr-3 flex-1">
                <Text className="text-[13px] font-semibold text-ink-secondary dark:text-ink-dark-secondary">
                  Today's progress
                </Text>
                <Text className="mt-1 text-[28px] font-bold tracking-tight text-ink dark:text-ink-dark">
                  {progress}%
                </Text>
                <Text className="mt-0.5 text-[13px] text-ink-muted">
                  {completedCount} of {tasks.length} tasks complete
                </Text>
              </View>
              <View className="h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                <Ionicons name="checkmark-done" size={22} color={colors.primary} />
              </View>
            </View>
            <View className="h-2 overflow-hidden rounded-full bg-surface-elevated dark:bg-surface-elevated-dark">
              <View
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.max(progress, progress > 0 ? 4 : 0)}%` }}
              />
            </View>
          </View>
        </Animated.View>

        {/* Stats row */}
        <Animated.View entering={FadeInUp.delay(70).duration(280)} className="mt-3 flex-row gap-3">
          <Pressable
            onPress={onFocus}
            className="min-w-0 flex-1 rounded-xl border border-border/80 bg-card p-3.5 dark:border-border-dark dark:bg-card-dark"
          >
            <View className="mb-2 h-8 w-8 items-center justify-center rounded-full bg-accent/10">
              <Ionicons name="timer-outline" size={16} color={colors.accent} />
            </View>
            <Text className="text-[12px] font-medium text-ink-secondary dark:text-ink-dark-secondary">
              Focus week
            </Text>
            <Text className="mt-0.5 text-[16px] font-bold text-ink dark:text-ink-dark">
              {formatFocusDuration(weekFocusSeconds)}
            </Text>
          </Pressable>
          <Pressable
            onPress={onFocus}
            className="min-w-0 flex-1 rounded-xl border border-border/80 bg-card p-3.5 dark:border-border-dark dark:bg-card-dark"
          >
            <View className="mb-2 h-8 w-8 items-center justify-center rounded-full bg-warning/15">
              <Ionicons name="flame-outline" size={16} color={colors.warning} />
            </View>
            <Text className="text-[12px] font-medium text-ink-secondary dark:text-ink-dark-secondary">
              Streak
            </Text>
            <Text className="mt-0.5 text-[16px] font-bold text-ink dark:text-ink-dark">
              {streak} days
            </Text>
          </Pressable>
        </Animated.View>

        {/* Quick actions — Facebook-style circular shortcuts */}
        <Animated.View entering={FadeInUp.delay(100).duration(280)} className="mt-4">
          <View className="flex-row justify-between px-1">
            {[
              { label: 'Task', icon: 'add' as const, onPress: onCreateTask, tint: colors.primary },
              {
                label: 'Orgs',
                icon: 'people' as const,
                onPress: onOrganizations,
                tint: colors.accent,
              },
              {
                label: 'Budget',
                icon: 'wallet' as const,
                onPress: onBudgets,
                tint: colors.secondary,
              },
              {
                label: 'Focus',
                icon: 'timer' as const,
                onPress: onFocus,
                tint: colors.warning,
              },
              {
                label: 'Cal',
                icon: 'calendar' as const,
                onPress: onCalendar,
                tint: colors.primaryDark,
              },
            ].map((action) => (
              <Pressable key={action.label} onPress={action.onPress} className="items-center">
                <View
                  className="mb-1.5 h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${action.tint}18` }}
                >
                  <Ionicons name={action.icon} size={22} color={action.tint} />
                </View>
                <Text
                  numberOfLines={1}
                  className={`font-semibold text-ink-secondary dark:text-ink-dark-secondary ${isCompact ? 'text-[10px]' : 'text-[11px]'}`}
                >
                  {action.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Feed */}
        <Animated.View entering={FadeInUp.delay(130).duration(280)} className="mt-5">
          <SectionHeader title="Today's tasks" actionLabel="See all" onAction={onSearch} />
          {isLoading ? (
            <View>
              <TaskSkeleton />
              <TaskSkeleton />
              <TaskSkeleton />
            </View>
          ) : null}
          {isError ? (
            <EmptyState
              title="Couldn’t load tasks"
              description="Check your connection and try again."
              actionLabel="Retry"
              onAction={() => void refetch()}
              icon="alert-circle-outline"
            />
          ) : null}
          {!isLoading && !isError && todayTasks.length === 0 ? (
            <EmptyState
              title="You’re clear for today"
              description="Add a task or start a focus session."
              actionLabel="New task"
              onAction={onCreateTask}
              icon="checkbox-outline"
            />
          ) : null}
          {todayTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => onTaskPress(task.id)}
              onToggle={() => toggleTask.mutate(task.id)}
            />
          ))}
        </Animated.View>

        {upcoming.length > 0 ? (
          <Animated.View entering={FadeInUp.delay(160).duration(280)} className="mt-1">
            <SectionHeader title="Upcoming" />
            {upcoming.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onPress={() => onTaskPress(task.id)}
                onToggle={() => toggleTask.mutate(task.id)}
              />
            ))}
          </Animated.View>
        ) : null}
      </View>
    </Screen>
  );
}
