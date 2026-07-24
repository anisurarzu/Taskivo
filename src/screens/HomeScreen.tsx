import { useMemo } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '@/components/buttons';
import { Screen } from '@/components/common';
import { TaskCard, Card, StatGrid } from '@/components/cards';
import { SearchInput } from '@/components/inputs';
import { Avatar, SectionHeader, Loading, EmptyState } from '@/components/ui';
import { formatDate, formatRelativeTime, getGreeting } from '@/utils/format';
import { colors } from '@/theme/colors';
import { useAuthStore } from '@/features/auth';
import { useAnalytics } from '@/features/analytics';
import {
  formatFocusDuration,
  getFocusSecondsThisWeek,
  useFocusSessionsQuery,
} from '@/features/focus';
import { CATEGORY_LABELS } from '@/constants';
import {
  getActiveTasks,
  getTaskProgress,
  getTodayTasks,
  getUpcomingTasks,
  useTasksQuery,
  useToggleTaskMutation,
  type Task,
  type TaskCategory,
} from '@/features/tasks';
import type { ActivityItem, StatItem } from '@/types';

interface HomeScreenProps {
  onSearch: () => void;
  onNotifications: () => void;
  onTaskPress: (id: string) => void;
  onCreateTask: () => void;
  onFocus?: () => void;
  onCalendar?: () => void;
}

function buildActivity(tasks: Task[]): ActivityItem[] {
  return tasks
    .slice()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6)
    .map((task) => {
      if (task.isCompleted) {
        return {
          id: `act_${task.id}_done`,
          title: 'Task completed',
          subtitle: task.title,
          timestamp: task.completedAt ?? task.updatedAt,
          type: 'completed' as const,
        };
      }
      return {
        id: `act_${task.id}_upd`,
        title: 'Task updated',
        subtitle: task.title,
        timestamp: task.updatedAt,
        type: 'updated' as const,
      };
    });
}

function buildCategoryProgress(tasks: Task[]) {
  const activeCategories = Object.keys(CATEGORY_LABELS) as TaskCategory[];
  return activeCategories
    .map((category) => {
      const items = tasks.filter((task) => task.category === category);
      if (items.length === 0) return null;
      const done = items.filter((task) => task.isCompleted).length;
      return {
        id: category,
        label: CATEGORY_LABELS[category],
        progress: done / items.length,
        total: items.length,
        done,
      };
    })
    .filter(Boolean)
    .slice(0, 3) as Array<{
    id: string;
    label: string;
    progress: number;
    total: number;
    done: number;
  }>;
}

export function HomeScreen({
  onSearch,
  onNotifications,
  onTaskPress,
  onCreateTask,
  onFocus,
  onCalendar,
}: HomeScreenProps) {
  const { width } = useWindowDimensions();
  const isCompact = width < 380;
  const user = useAuthStore((s) => s.user);
  const { data: tasks = [], isLoading, isError, refetch } = useTasksQuery();
  const { data: sessions = [] } = useFocusSessionsQuery();
  const { stats, streak } = useAnalytics();
  const toggleTask = useToggleTaskMutation();

  const displayName = user?.name?.trim() || user?.email?.split('@')[0] || 'there';
  const firstName = displayName.split(' ')[0] ?? displayName;

  const todayTasks = useMemo(() => {
    const dueToday = getTodayTasks(tasks);
    if (dueToday.length > 0) return dueToday.slice(0, 4);
    return getActiveTasks(tasks).slice(0, 4);
  }, [tasks]);

  const upcoming = useMemo(() => getUpcomingTasks(tasks).slice(0, 4), [tasks]);
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const progress = getTaskProgress(tasks);
  const weekFocusSeconds = getFocusSecondsThisWeek(sessions);
  const weekFocusGoalSeconds = 15 * 60 * 60;
  const categoryProgress = useMemo(() => buildCategoryProgress(tasks), [tasks]);
  const activity = useMemo(() => buildActivity(tasks), [tasks]);

  const dashboardStats = useMemo<StatItem[]>(() => {
    if (stats.length > 0) return stats.slice(0, 4);
    return [];
  }, [stats]);

  return (
    <Screen scroll tabBar>
      <Animated.View entering={FadeInDown.duration(400)} className="pt-2">
        <View className="mb-5 flex-row items-center justify-between">
          <View className="min-w-0 flex-1 flex-row items-center pr-3">
            <Avatar name={displayName} uri={user?.avatarUrl} size="md" />
            <View className="ml-3 min-w-0 flex-1">
              <Text className="text-sm text-ink-secondary dark:text-ink-dark-secondary">
                {getGreeting()}
              </Text>
              <Text numberOfLines={1} className="text-xl font-bold text-ink dark:text-ink-dark">
                {firstName}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-1">
            <IconButton name="notifications-outline" variant="soft" onPress={onNotifications} />
            <IconButton name="add" variant="filled" onPress={onCreateTask} />
          </View>
        </View>

        <Text className="mb-4 text-sm font-medium text-ink-secondary dark:text-ink-dark-secondary">
          {formatDate(new Date())}
        </Text>

        <Pressable onPress={onSearch}>
          <View pointerEvents="none">
            <SearchInput editable={false} />
          </View>
        </Pressable>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(60).duration(450)} className="mt-6">
        <Card className="overflow-hidden border-0 bg-primary p-5" elevated={false}>
          <View className="mb-4 flex-row items-start justify-between">
            <View className="mr-3 flex-1">
              <Text className="text-sm font-medium text-white/80">Today’s summary</Text>
              <Text className="mt-1 text-3xl font-bold text-white">{progress}%</Text>
              <Text className="mt-1 text-sm text-white/80">
                {completedCount} of {tasks.length} tasks done
              </Text>
            </View>
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <Ionicons name="leaf-outline" size={24} color="#FFFFFF" />
            </View>
          </View>
          <View className="h-2 overflow-hidden rounded-full bg-white/20">
            <View className="h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
          </View>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(100).duration(450)} className="mt-6">
        <SectionHeader title="Quick actions" />
        <View className="flex-row gap-3">
          {[
            { label: 'New task', icon: 'add-circle-outline' as const, onPress: onCreateTask },
            { label: 'Focus', icon: 'timer-outline' as const, onPress: onFocus },
            { label: 'Calendar', icon: 'calendar-outline' as const, onPress: onCalendar },
          ].map((action) => (
            <Pressable
              key={action.label}
              onPress={action.onPress}
              className="min-w-0 flex-1 items-center rounded-lg border border-border bg-card py-3.5 dark:border-border-dark dark:bg-card-dark"
            >
              <View className="mb-2 h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Ionicons name={action.icon} size={18} color={colors.primary} />
              </View>
              <Text
                numberOfLines={1}
                className={`font-semibold text-ink dark:text-ink-dark ${isCompact ? 'text-[11px]' : 'text-xs'}`}
              >
                {action.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>

      {dashboardStats.length > 0 ? (
        <Animated.View entering={FadeInUp.delay(140).duration(450)} className="mt-6">
          <SectionHeader title="Statistics" />
          <StatGrid stats={dashboardStats} />
        </Animated.View>
      ) : null}

      <Animated.View entering={FadeInUp.delay(180).duration(450)} className="mt-2">
        <SectionHeader title="By category" subtitle="Your task mix" />
        <Card>
          {categoryProgress.length === 0 ? (
            <Text className="text-sm text-ink-secondary dark:text-ink-dark-secondary">
              Create tasks to see category progress.
            </Text>
          ) : (
            categoryProgress.map((item, index) => (
              <View
                key={item.id}
                className={`py-3 ${
                  index < categoryProgress.length - 1
                    ? 'border-b border-border dark:border-border-dark'
                    : ''
                }`}
              >
                <View className="mb-2 flex-row items-center justify-between">
                  <Text className="text-sm font-semibold text-ink dark:text-ink-dark">
                    {item.label}
                  </Text>
                  <Text className="text-xs font-medium text-primary">
                    {item.done}/{item.total}
                  </Text>
                </View>
                <View className="h-1.5 overflow-hidden rounded-full bg-surface-elevated dark:bg-surface-elevated-dark">
                  <View
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.round(item.progress * 100)}%` }}
                  />
                </View>
              </View>
            ))
          )}
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(220).duration(450)} className="mt-6">
        <SectionHeader title="Goals" subtitle="This week" />
        <View className="flex-row gap-3">
          <Card className="min-w-0 flex-1">
            <Text className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Deep work
            </Text>
            <Text className="mt-2 text-xl font-bold text-ink dark:text-ink-dark">
              {formatFocusDuration(weekFocusSeconds)} / 15h
            </Text>
            <View className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-elevated dark:bg-surface-elevated-dark">
              <View
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round((weekFocusSeconds / weekFocusGoalSeconds) * 100),
                  )}%`,
                }}
              />
            </View>
          </Card>
          <Card className="min-w-0 flex-1">
            <Text className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Focus streak
            </Text>
            <Text className="mt-2 text-xl font-bold text-ink dark:text-ink-dark">{streak} days</Text>
          </Card>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(260).duration(450)} className="mt-6">
        <SectionHeader title="Today’s tasks" actionLabel="View all" onAction={onSearch} />
        {isLoading ? <Loading label="Loading tasks..." /> : null}
        {isError ? (
          <EmptyState
            title="Couldn’t load tasks"
            description="Pull to retry or tap below."
            actionLabel="Try again"
            onAction={() => void refetch()}
            icon="alert-circle-outline"
          />
        ) : null}
        {!isLoading && !isError && todayTasks.length === 0 ? (
          <EmptyState
            title="No tasks for today"
            description="Create a task to get started."
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
        <Animated.View entering={FadeInUp.delay(300).duration(450)} className="mt-2">
          <SectionHeader title="Upcoming schedule" />
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

      <Animated.View entering={FadeInUp.delay(340).duration(450)} className="mt-2">
        <SectionHeader title="Recent activity" />
        <Card padded={false}>
          {activity.length === 0 ? (
            <View className="px-4 py-4">
              <Text className="text-sm text-ink-secondary dark:text-ink-dark-secondary">
                Task updates will appear here.
              </Text>
            </View>
          ) : (
            activity.map((item, index) => (
              <View
                key={item.id}
                className={`flex-row items-center px-4 py-3.5 ${
                  index < activity.length - 1
                    ? 'border-b border-border dark:border-border-dark'
                    : ''
                }`}
              >
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Ionicons
                    name={
                      item.type === 'completed'
                        ? 'checkmark-circle'
                        : item.type === 'created'
                          ? 'add-circle'
                          : 'notifications'
                    }
                    size={18}
                    color={colors.primary}
                  />
                </View>
                <View className="min-w-0 flex-1">
                  <Text
                    numberOfLines={1}
                    className="text-sm font-semibold text-ink dark:text-ink-dark"
                  >
                    {item.title}
                  </Text>
                  <Text className="text-xs text-ink-secondary dark:text-ink-dark-secondary">
                    {item.subtitle} · {formatRelativeTime(item.timestamp)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </Card>
      </Animated.View>
    </Screen>
  );
}
