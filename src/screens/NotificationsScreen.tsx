import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/common';
import { Card } from '@/components/cards';
import { IconButton } from '@/components/buttons';
import { EmptyState } from '@/components/ui';
import { formatRelativeTime } from '@/utils/format';
import { colors } from '@/theme/colors';
import { useTasksQuery } from '@/features/tasks';
import {
  useMarkNotificationsReadMutation,
  useNotificationsQuery,
} from '@/features/notifications';

interface NotificationsScreenProps {
  onBack: () => void;
}

const iconForType = {
  task_due: 'alarm-outline',
  task_reminder: 'notifications-outline',
  focus_complete: 'flame-outline',
  weekly_summary: 'stats-chart-outline',
  system: 'information-circle-outline',
} as const;

export function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  const { data: tasks = [] } = useTasksQuery();
  const { data: notifications = [], refetch } = useNotificationsQuery(tasks);
  const markRead = useMarkNotificationsReadMutation();

  useEffect(() => {
    void markRead.mutateAsync();
    // Mark as read once when opening the screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Screen scroll>
      <Animated.View entering={FadeInDown.duration(400)} className="pt-2">
        <View className="mb-6 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <IconButton name="chevron-back" onPress={onBack} className="-ml-2" />
            <Text className="ml-1 text-2xl font-bold text-ink dark:text-ink-dark">
              Notifications
            </Text>
          </View>
          <Pressable onPress={() => void refetch()}>
            <Text className="text-xs font-semibold text-primary">Refresh</Text>
          </Pressable>
        </View>

        {notifications.length === 0 ? (
          <EmptyState
            title="All caught up"
            description="Due reminders and focus updates will show up here."
            icon="notifications-off-outline"
          />
        ) : (
          <Card padded={false}>
            {notifications.map((item, index) => (
              <View
                key={item.id}
                className={`flex-row px-4 py-4 ${
                  index < notifications.length - 1
                    ? 'border-b border-border dark:border-border-dark'
                    : ''
                }`}
              >
                <View className="mr-3 h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <Ionicons
                    name={iconForType[item.type] ?? 'notifications-outline'}
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <View className="min-w-0 flex-1">
                  <Text className="mb-0.5 text-base font-semibold text-ink dark:text-ink-dark">
                    {item.title}
                  </Text>
                  <Text className="mb-1 text-sm leading-5 text-ink-secondary dark:text-ink-dark-secondary">
                    {item.body}
                  </Text>
                  <Text className="text-xs text-ink-muted">
                    {formatRelativeTime(item.createdAt)}
                  </Text>
                </View>
              </View>
            ))}
          </Card>
        )}
      </Animated.View>
    </Screen>
  );
}
