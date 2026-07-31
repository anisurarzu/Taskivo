import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/common';
import { Card } from '@/components/cards';
import { Avatar } from '@/components/ui';
import { SecondaryButton } from '@/components/buttons';
import { useThemeColors } from '@/hooks';
import { useAuthStore } from '@/features/auth';
import { useAnalytics } from '@/features/analytics';

interface ProfileScreenProps {
  onSettings: () => void;
  onNotifications: () => void;
  onEditProfile: () => void;
  onOrganizations: () => void;
  onBudgets: () => void;
  onAnalytics: () => void;
  onCalendar: () => void;
  onSignOut: () => void;
}

export function ProfileScreen({
  onSettings,
  onNotifications,
  onEditProfile,
  onOrganizations,
  onBudgets,
  onAnalytics,
  onCalendar,
  onSignOut,
}: ProfileScreenProps) {
  const theme = useThemeColors();
  const user = useAuthStore((s) => s.user);
  const isDemo = useAuthStore((s) => s.isDemo);
  const { completed, streak } = useAnalytics();

  const name = user?.name ?? 'Taskivo user';
  const email = user?.email ?? 'Add your email';

  const menuItems = [
    { label: 'Edit profile', icon: 'create-outline' as const, onPress: onEditProfile },
    { label: 'Organizations', icon: 'people-outline' as const, onPress: onOrganizations },
    { label: 'Budgets', icon: 'wallet-outline' as const, onPress: onBudgets },
    { label: 'Analytics', icon: 'stats-chart-outline' as const, onPress: onAnalytics },
    { label: 'Calendar', icon: 'calendar-outline' as const, onPress: onCalendar },
    { label: 'Preferences', icon: 'options-outline' as const, onPress: onSettings },
    { label: 'Notifications', icon: 'notifications-outline' as const, onPress: onNotifications },
  ];

  return (
    <Screen scroll tabBar>
      <Animated.View entering={FadeInDown.duration(360)} className="items-center pt-3">
        <Avatar name={name} uri={user?.avatarUrl} size="xl" />
        <Text className="mt-4 text-2xl font-bold text-ink dark:text-ink-dark">{name}</Text>
        <Text className="mt-1 text-sm text-ink-secondary dark:text-ink-dark-secondary">
          {email}
        </Text>
        <View className="mt-3 flex-row gap-2">
          {user?.emailVerified ? (
            <View className="rounded-full bg-primary/10 px-3 py-1">
              <Text className="text-xs font-semibold uppercase tracking-wide text-primary">
                Verified
              </Text>
            </View>
          ) : null}
          {isDemo ? (
            <View className="rounded-full bg-warning/15 px-3 py-1">
              <Text className="text-xs font-semibold uppercase tracking-wide text-warning">
                Demo
              </Text>
            </View>
          ) : null}
        </View>

        <View className="mt-6 w-full flex-row gap-3">
          <Card className="min-w-0 flex-1 items-center py-3.5">
            <Text className="text-xl font-bold text-ink dark:text-ink-dark">{completed}</Text>
            <Text className="mt-1 text-xs text-ink-secondary dark:text-ink-dark-secondary">
              Completed
            </Text>
          </Card>
          <Card className="min-w-0 flex-1 items-center py-3.5">
            <Text className="text-xl font-bold text-ink dark:text-ink-dark">{streak}d</Text>
            <Text className="mt-1 text-xs text-ink-secondary dark:text-ink-dark-secondary">
              Focus streak
            </Text>
          </Card>
        </View>

        <Card className="mt-6 w-full" padded={false}>
          {menuItems.map((item, index) => (
            <Pressable
              key={item.label}
              onPress={item.onPress}
              className={`flex-row items-center px-4 py-3.5 ${
                index < menuItems.length - 1
                  ? 'border-b border-border dark:border-border-dark'
                  : ''
              }`}
            >
              <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-surface-elevated dark:bg-surface-elevated-dark">
                <Ionicons name={item.icon} size={18} color={theme.primary} />
              </View>
              <Text className="flex-1 text-[15px] font-medium text-ink dark:text-ink-dark">
                {item.label}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
            </Pressable>
          ))}
        </Card>

        <View className="mt-6 w-full">
          <SecondaryButton label="Open settings" onPress={onSettings} />
          <Pressable onPress={onSignOut} className="mt-4 items-center py-3">
            <Text className="text-base font-semibold text-danger">Sign out</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Screen>
  );
}
