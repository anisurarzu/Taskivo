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
  onSignOut: () => void;
}

export function ProfileScreen({ onSettings, onNotifications, onSignOut }: ProfileScreenProps) {
  const theme = useThemeColors();
  const user = useAuthStore((s) => s.user);
  const { completed, streak } = useAnalytics();

  const name = user?.name ?? 'Taskivo user';
  const email = user?.email ?? 'Add your email';

  const menuItems = [
    { label: 'Preferences', icon: 'options-outline' as const, onPress: onSettings },
    {
      label: 'Notifications',
      icon: 'notifications-outline' as const,
      onPress: onNotifications,
    },
    { label: 'Account', icon: 'person-outline' as const, onPress: onSettings },
  ];

  return (
    <Screen scroll tabBar>
      <Animated.View entering={FadeInDown.duration(400)} className="items-center pt-4">
        <Avatar name={name} uri={user?.avatarUrl} size="xl" />
        <Text className="mt-4 text-2xl font-bold text-ink dark:text-ink-dark">{name}</Text>
        <Text className="mt-1 text-sm text-ink-secondary dark:text-ink-dark-secondary">
          {email}
        </Text>
        {user?.emailVerified ? (
          <View className="mt-3 rounded-full bg-primary/10 px-3 py-1">
            <Text className="text-xs font-semibold uppercase tracking-wide text-primary">
              Verified
            </Text>
          </View>
        ) : null}

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
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-surface-elevated dark:bg-surface-elevated-dark">
                <Ionicons name={item.icon} size={18} color={theme.primary} />
              </View>
              <Text className="flex-1 text-base font-medium text-ink dark:text-ink-dark">
                {item.label}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
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
