import { useMemo } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '@/components/buttons';
import { Screen } from '@/components/common';
import { TaskCard, Card } from '@/components/cards';
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

        <Text className="mb-4 text-sm font-medium text-ink-muted dark:text-ink-dark-secondary">
          {formatDate(new Date())}
        </Text>

        <Pressable onPress={onSearch}>
          <View pointerEvents="none">
            <SearchInput editable={false} placeholder="Search tasks" />
          </View>
        </Pressable>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(60).duration(450)} className="mt-6">
        <Card className="overflow-hidden border-0 bg-primary p-5" elevated={false}>
          <View className="mb-4 flex-row items-start justify-between">
            <View className="mr-3 flex-1">
              <Text className="text-sm font-medium text-white/80">Today</Text>
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

      <Animated.View entering={FadeInUp.delay(100).duration(450)} className="mt-5">
        <View className="flex-row gap-3">
          <Pressable
            onPress={onFocus}
            className="min-w-0 flex-1 rounded-card border border-border bg-card p-3.5 dark:border-border-dark dark:bg-card-dark"
          >
            <Text className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted dark:text-ink-dark-secondary">
              Focus this week
            </Text>
            <Text className="mt-1.5 text-lg font-bold text-ink dark:text-ink-dark">
              {formatFocusDuration(weekFocusSeconds)}
            </Text>
          </Pressable>
          <Pressable
            onPress={onFocus}
            className="min-w-0 flex-1 rounded-card border border-border bg-card p-3.5 dark:border-border-dark dark:bg-card-dark"
          >
            <Text className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted dark:text-ink-dark-secondary">
              Streak
            </Text>
            <Text className="mt-1.5 text-lg font-bold text-ink dark:text-ink-dark">
              {streak} days
            </Text>
          </Pressable>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(140).duration(450)} className="mt-6">
        <View className="mb-3 flex-row gap-2">
          {[
            { label: 'New task', icon: 'add-circle-outline' as const, onPress: onCreateTask },
            { label: 'Focus', icon: 'timer-outline' as const, onPress: onFocus },
            { label: 'Calendar', icon: 'calendar-outline' as const, onPress: onCalendar },
          ].map((action) => (
            <Pressable
              key={action.label}
              onPress={action.onPress}
              className="min-w-0 flex-1 items-center rounded-card border border-border bg-card py-3 dark:border-border-dark dark:bg-card-dark"
            >
              <View className="mb-1.5 h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Ionicons name={action.icon} size={16} color={colors.primary} />
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

      <Animated.View entering={FadeInUp.delay(180).duration(450)} className="mt-4">
        <SectionHeader title="Today’s tasks" actionLabel="Search" onAction={onSearch} />
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
        <Animated.View entering={FadeInUp.delay(220).duration(450)} className="mt-2">
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
    </Screen>
  );
}
