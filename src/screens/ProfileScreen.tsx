import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/common';
import { Card } from '@/components/cards';
import { Avatar } from '@/components/ui';
import { SecondaryButton } from '@/components/buttons';
import { mockUser } from '@/data/mock';
import { useThemeColors } from '@/hooks';

interface ProfileScreenProps {
  onSettings: () => void;
  onSignOut: () => void;
}

const menuItems = [
  { label: 'Account', icon: 'person-outline' as const },
  { label: 'Preferences', icon: 'options-outline' as const, action: 'settings' as const },
  { label: 'Notifications', icon: 'notifications-outline' as const },
  { label: 'Privacy', icon: 'shield-checkmark-outline' as const },
  { label: 'Help & Support', icon: 'help-circle-outline' as const },
];

export function ProfileScreen({ onSettings, onSignOut }: ProfileScreenProps) {
  const theme = useThemeColors();

  return (
    <Screen scroll tabBar>
      <Animated.View entering={FadeInDown.duration(400)} className="items-center pt-4">
        <Avatar name={mockUser.name} size="xl" />
        <Text className="mt-4 text-2xl font-bold text-ink dark:text-ink-dark">{mockUser.name}</Text>
        <Text className="mt-1 text-sm text-ink-secondary dark:text-ink-dark-secondary">
          {mockUser.email}
        </Text>
        <View className="mt-3 rounded-full bg-primary/10 px-3 py-1">
          <Text className="text-xs font-semibold uppercase tracking-wide text-primary">
            {mockUser.plan} plan
          </Text>
        </View>

        <Card className="mt-8 w-full" padded={false}>
          {menuItems.map((item, index) => (
            <Pressable
              key={item.label}
              onPress={item.action === 'settings' ? onSettings : undefined}
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
