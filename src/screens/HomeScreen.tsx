import { useMemo, useState } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '@/components/buttons';
import { Screen } from '@/components/common';
import { TaskCard, Card, StatGrid } from '@/components/cards';
import { SearchInput } from '@/components/inputs';
import { Avatar, SectionHeader } from '@/components/ui';
import { mockActivity, mockStats, mockTasks, mockUser } from '@/data/mock';
import { formatDate, formatRelativeTime, getGreeting } from '@/utils/format';
import type { Task } from '@/types';
import { colors } from '@/theme/colors';

interface HomeScreenProps {
  onSearch: () => void;
  onNotifications: () => void;
  onTaskPress: (id: string) => void;
  onCreateTask: () => void;
  onFocus?: () => void;
  onCalendar?: () => void;
}

const habits = [
  { id: '1', label: 'Morning stretch', progress: 0.8 },
  { id: '2', label: 'Read 20 pages', progress: 0.45 },
  { id: '3', label: 'Drink water', progress: 0.9 },
];

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
  const [tasks, setTasks] = useState(mockTasks);

  const todayTasks = useMemo(() => tasks.filter((t) => !t.isCompleted).slice(0, 3), [tasks]);
  const upcoming = useMemo(() => tasks.filter((t) => !t.isCompleted).slice(3), [tasks]);
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const progress = Math.round((completedCount / Math.max(tasks.length, 1)) * 100);

  const dashboardStats = useMemo(
    () =>
      mockStats.map((s) => ({
        ...s,
        color: s.color === '#4F46E5' ? colors.primary : s.color === '#7C3AED' ? colors.secondary : s.color === '#06B6D4' ? colors.accent : s.color,
      })),
    [],
  );

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              isCompleted: !task.isCompleted,
              status: (!task.isCompleted ? 'completed' : 'todo') as Task['status'],
            }
          : task,
      ),
    );
  };

  return (
    <Screen scroll tabBar>
      <Animated.View entering={FadeInDown.duration(400)} className="pt-2">
        <View className="mb-5 flex-row items-center justify-between">
          <View className="min-w-0 flex-1 flex-row items-center pr-3">
            <Avatar name={mockUser.name} size="md" />
            <View className="ml-3 min-w-0 flex-1">
              <Text className="text-sm text-ink-secondary dark:text-ink-dark-secondary">
                {getGreeting()}
              </Text>
              <Text
                numberOfLines={1}
                className="text-xl font-bold text-ink dark:text-ink-dark"
              >
                {mockUser.name.split(' ')[0]}
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
              className="min-w-0 flex-1 items-center rounded-card border border-border bg-card py-4 dark:border-border-dark dark:bg-card-dark"
            >
              <View className="mb-2 h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Ionicons name={action.icon} size={20} color={colors.primary} />
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

      <Animated.View entering={FadeInUp.delay(140).duration(450)} className="mt-6">
        <SectionHeader title="Statistics" />
        <StatGrid stats={dashboardStats.slice(0, 4)} />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(180).duration(450)} className="mt-2">
        <SectionHeader title="Habits" subtitle="Stay consistent" />
        <Card>
          {habits.map((habit, index) => (
            <View
              key={habit.id}
              className={`py-3 ${index < habits.length - 1 ? 'border-b border-border dark:border-border-dark' : ''}`}
            >
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-ink dark:text-ink-dark">
                  {habit.label}
                </Text>
                <Text className="text-xs font-medium text-primary">
                  {Math.round(habit.progress * 100)}%
                </Text>
              </View>
              <View className="h-1.5 overflow-hidden rounded-full bg-surface-elevated dark:bg-surface-elevated-dark">
                <View
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${habit.progress * 100}%` }}
                />
              </View>
            </View>
          ))}
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(220).duration(450)} className="mt-6">
        <SectionHeader title="Goals" subtitle="This week" />
        <View className="flex-row gap-3">
          <Card className="min-w-0 flex-1">
            <Text className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Deep work
            </Text>
            <Text className="mt-2 text-xl font-bold text-ink dark:text-ink-dark">12h / 15h</Text>
          </Card>
          <Card className="min-w-0 flex-1">
            <Text className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Focus streak
            </Text>
            <Text className="mt-2 text-xl font-bold text-ink dark:text-ink-dark">8 days</Text>
          </Card>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(260).duration(450)} className="mt-6">
        <SectionHeader title="Today’s tasks" actionLabel="View all" onAction={() => undefined} />
        {todayTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onPress={() => onTaskPress(task.id)}
            onToggle={() => toggleTask(task.id)}
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
              onToggle={() => toggleTask(task.id)}
            />
          ))}
        </Animated.View>
      ) : null}

      <Animated.View entering={FadeInUp.delay(340).duration(450)} className="mt-2">
        <SectionHeader title="Recent activity" />
        <Card padded={false}>
          {mockActivity.map((item, index) => (
            <View
              key={item.id}
              className={`flex-row items-center px-4 py-3.5 ${
                index < mockActivity.length - 1
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
                <Text numberOfLines={1} className="text-sm font-semibold text-ink dark:text-ink-dark">
                  {item.title}
                </Text>
                <Text className="text-xs text-ink-secondary dark:text-ink-dark-secondary">
                  {item.subtitle} · {formatRelativeTime(item.timestamp)}
                </Text>
              </View>
            </View>
          ))}
        </Card>
      </Animated.View>
    </Screen>
  );
}
