import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '@/components/buttons';
import { Screen } from '@/components/common';
import { TaskCard, StatCard, Card } from '@/components/cards';
import { SearchInput } from '@/components/inputs';
import { Avatar, SectionHeader } from '@/components/ui';
import { mockActivity, mockStats, mockTasks, mockUser } from '@/data/mock';
import { formatDate, formatRelativeTime, getGreeting } from '@/utils/format';
import type { Task } from '@/types';

interface HomeScreenProps {
  onSearch: () => void;
  onNotifications: () => void;
  onTaskPress: (id: string) => void;
  onCreateTask: () => void;
}

export function HomeScreen({
  onSearch,
  onNotifications,
  onTaskPress,
  onCreateTask,
}: HomeScreenProps) {
  const [tasks, setTasks] = useState(mockTasks);
  const todayTasks = tasks.filter((t) => !t.isCompleted).slice(0, 3);
  const upcoming = tasks.filter((t) => !t.isCompleted).slice(3);
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const progress = Math.round((completedCount / tasks.length) * 100);

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
    <Screen scroll edges={['top', 'left', 'right']}>
      <Animated.View entering={FadeInDown.duration(400)} className="pt-2">
        <View className="mb-5 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Avatar name={mockUser.name} size="md" />
            <View className="ml-3">
              <Text className="text-sm text-ink-secondary dark:text-ink-dark-secondary">
                {getGreeting()},
              </Text>
              <Text className="text-xl font-bold text-ink dark:text-ink-dark">
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

      <Animated.View entering={FadeInUp.delay(80).duration(450)} className="mt-6">
        <Card className="overflow-hidden border-0 bg-primary p-5">
          <View className="mb-4 flex-row items-center justify-between">
            <View>
              <Text className="text-sm font-medium text-white/80">Today’s progress</Text>
              <Text className="mt-1 text-3xl font-bold text-white">{progress}%</Text>
            </View>
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
              <Ionicons name="trophy-outline" size={26} color="#FFFFFF" />
            </View>
          </View>
          <View className="h-2 overflow-hidden rounded-full bg-white/20">
            <View className="h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
          </View>
          <Text className="mt-3 text-sm text-white/80">
            {completedCount} of {tasks.length} tasks completed
          </Text>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(120).duration(450)} className="mt-6">
        <SectionHeader title="Quick actions" />
        <View className="flex-row gap-3">
          {[
            { label: 'New task', icon: 'add-circle-outline' as const, onPress: onCreateTask },
            { label: 'Focus', icon: 'timer-outline' as const, onPress: () => undefined },
            { label: 'Calendar', icon: 'calendar-outline' as const, onPress: () => undefined },
          ].map((action) => (
            <Pressable
              key={action.label}
              onPress={action.onPress}
              className="flex-1 items-center rounded-card border border-border/70 bg-surface py-4 dark:border-border-dark dark:bg-surface-dark"
            >
              <Ionicons name={action.icon} size={22} color="#4F46E5" />
              <Text className="mt-2 text-xs font-semibold text-ink dark:text-ink-dark">
                {action.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(160).duration(450)} className="mt-6">
        <SectionHeader title="Statistics" actionLabel="See all" onAction={() => undefined} />
        <View className="flex-row flex-wrap gap-3">
          {mockStats.slice(0, 2).map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200).duration(450)} className="mt-6">
        <SectionHeader
          title="Today’s tasks"
          actionLabel="View all"
          onAction={() => undefined}
        />
        {todayTasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            index={index}
            onPress={() => onTaskPress(task.id)}
            onToggle={() => toggleTask(task.id)}
          />
        ))}
      </Animated.View>

      {upcoming.length > 0 ? (
        <Animated.View entering={FadeInUp.delay(240).duration(450)} className="mt-2">
          <SectionHeader title="Upcoming" />
          {upcoming.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              onPress={() => onTaskPress(task.id)}
              onToggle={() => toggleTask(task.id)}
            />
          ))}
        </Animated.View>
      ) : null}

      <Animated.View entering={FadeInUp.delay(280).duration(450)} className="mt-2 mb-4">
        <SectionHeader title="Recent activity" />
        <Card>
          {mockActivity.map((item, index) => (
            <View
              key={item.id}
              className={`flex-row items-center py-3 ${
                index < mockActivity.length - 1 ? 'border-b border-border/60 dark:border-border-dark' : ''
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
                  color="#4F46E5"
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-ink dark:text-ink-dark">
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
