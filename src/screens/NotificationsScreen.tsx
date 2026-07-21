import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/common';
import { Card } from '@/components/cards';
import { IconButton } from '@/components/buttons';
import { EmptyState } from '@/components/ui';
import { formatRelativeTime } from '@/utils/format';
import { colors } from '@/theme/colors';

interface NotificationsScreenProps {
  onBack: () => void;
}

const notifications = [
  {
    id: '1',
    title: 'Task due soon',
    body: 'Finalize product roadmap is due in 2 hours',
    time: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    icon: 'alarm-outline' as const,
  },
  {
    id: '2',
    title: 'Focus streak',
    body: 'You’re on an 8-day focus streak. Keep it going!',
    time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    icon: 'flame-outline' as const,
  },
  {
    id: '3',
    title: 'Weekly summary',
    body: 'You completed 12 tasks this week — 18% more than last week.',
    time: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    icon: 'stats-chart-outline' as const,
  },
];

export function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  return (
    <Screen scroll>
      <Animated.View entering={FadeInDown.duration(400)} className="pt-2">
        <View className="mb-6 flex-row items-center">
          <IconButton name="chevron-back" onPress={onBack} className="-ml-2" />
          <Text className="ml-1 text-2xl font-bold text-ink dark:text-ink-dark">
            Notifications
          </Text>
        </View>

        {notifications.length === 0 ? (
          <EmptyState
            title="All caught up"
            description="You have no new notifications."
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
                  <Ionicons name={item.icon} size={20} color={colors.primary} />
                </View>
                <View className="min-w-0 flex-1">
                  <Text className="mb-0.5 text-base font-semibold text-ink dark:text-ink-dark">
                    {item.title}
                  </Text>
                  <Text className="mb-1 text-sm leading-5 text-ink-secondary dark:text-ink-dark-secondary">
                    {item.body}
                  </Text>
                  <Text className="text-xs text-ink-muted">{formatRelativeTime(item.time)}</Text>
                </View>
              </View>
            ))}
          </Card>
        )}
      </Animated.View>
    </Screen>
  );
}
