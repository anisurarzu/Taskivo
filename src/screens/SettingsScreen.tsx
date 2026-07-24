import { Pressable, Switch, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Screen } from '@/components/common';
import { Card } from '@/components/cards';
import { IconButton } from '@/components/buttons';
import { useThemeStore } from '@/store';
import { usePreferencesStore } from '@/store/preferences-store';
import { useFocusUiStore, FOCUS_PRESETS_MINUTES } from '@/features/focus';
import {
  useRequestNotificationPermissionMutation,
} from '@/features/notifications';
import { colors } from '@/theme/colors';
import { API_CONFIG } from '@/services/api/config';
import { cn } from '@/utils/cn';

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { preference, setPreference } = useThemeStore();
  const isDark = preference === 'dark';
  const isSystem = preference === 'system';

  const hapticsEnabled = usePreferencesStore((s) => s.hapticsEnabled);
  const notificationsEnabled = usePreferencesStore((s) => s.notificationsEnabled);
  const defaultFocusMinutes = usePreferencesStore((s) => s.defaultFocusMinutes);
  const weekStartsOn = usePreferencesStore((s) => s.weekStartsOn);
  const setHapticsEnabled = usePreferencesStore((s) => s.setHapticsEnabled);
  const setNotificationsEnabled = usePreferencesStore((s) => s.setNotificationsEnabled);
  const setDefaultFocusMinutes = usePreferencesStore((s) => s.setDefaultFocusMinutes);
  const setWeekStartsOn = usePreferencesStore((s) => s.setWeekStartsOn);
  const setFocusDuration = useFocusUiStore((s) => s.setDurationMinutes);
  const requestPermission = useRequestNotificationPermissionMutation();

  return (
    <Screen scroll>
      <Animated.View entering={FadeInDown.duration(400)} className="pt-2">
        <View className="mb-6 flex-row items-center">
          <IconButton name="chevron-back" onPress={onBack} className="-ml-2" />
          <Text className="ml-1 text-2xl font-bold text-ink dark:text-ink-dark">Settings</Text>
        </View>

        <Text className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-secondary dark:text-ink-dark-secondary">
          Appearance
        </Text>
        <Card className="mb-6">
          <View className="mb-4 flex-row items-center justify-between">
            <View className="mr-4 min-w-0 flex-1">
              <Text className="text-base font-semibold text-ink dark:text-ink-dark">Dark mode</Text>
              <Text className="mt-0.5 text-sm text-ink-secondary dark:text-ink-dark-secondary">
                Use a darker color palette
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={(value) => setPreference(value ? 'dark' : 'light')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View className="flex-row items-center justify-between border-t border-border pt-4 dark:border-border-dark">
            <View className="mr-4 min-w-0 flex-1">
              <Text className="text-base font-semibold text-ink dark:text-ink-dark">
                Match system
              </Text>
              <Text className="mt-0.5 text-sm text-ink-secondary dark:text-ink-dark-secondary">
                Follow device appearance
              </Text>
            </View>
            <Switch
              value={isSystem}
              onValueChange={(value) => setPreference(value ? 'system' : isDark ? 'dark' : 'light')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>

        <Text className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-secondary dark:text-ink-dark-secondary">
          General
        </Text>
        <Card className="mb-6">
          <View className="mb-4 flex-row items-center justify-between">
            <View className="mr-4 min-w-0 flex-1">
              <Text className="text-base font-semibold text-ink dark:text-ink-dark">
                Haptic feedback
              </Text>
              <Text className="mt-0.5 text-sm text-ink-secondary dark:text-ink-dark-secondary">
                Light taps on buttons and actions
              </Text>
            </View>
            <Switch
              value={hapticsEnabled}
              onValueChange={setHapticsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View className="mb-4 flex-row items-center justify-between border-t border-border pt-4 dark:border-border-dark">
            <View className="mr-4 min-w-0 flex-1">
              <Text className="text-base font-semibold text-ink dark:text-ink-dark">
                Notifications
              </Text>
              <Text className="mt-0.5 text-sm text-ink-secondary dark:text-ink-dark-secondary">
                Task due reminders on this device
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={(value) => {
                setNotificationsEnabled(value);
                if (value) void requestPermission.mutateAsync();
              }}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View className="border-t border-border pt-4 dark:border-border-dark">
            <Text className="mb-2 text-base font-semibold text-ink dark:text-ink-dark">
              Start of week
            </Text>
            <View className="flex-row gap-2">
              {(['monday', 'sunday'] as const).map((value) => (
                <Pressable
                  key={value}
                  onPress={() => setWeekStartsOn(value)}
                  className={cn(
                    'rounded-full px-3 py-1.5',
                    weekStartsOn === value
                      ? 'bg-primary'
                      : 'bg-surface-elevated dark:bg-surface-elevated-dark',
                  )}
                >
                  <Text
                    className={cn(
                      'text-xs font-semibold capitalize',
                      weekStartsOn === value ? 'text-white' : 'text-ink dark:text-ink-dark',
                    )}
                  >
                    {value}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Card>

        <Text className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-secondary dark:text-ink-dark-secondary">
          Focus
        </Text>
        <Card className="mb-6">
          <Text className="mb-2 text-base font-semibold text-ink dark:text-ink-dark">
            Default focus length
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {FOCUS_PRESETS_MINUTES.map((preset) => (
              <Pressable
                key={preset}
                onPress={() => {
                  setDefaultFocusMinutes(preset);
                  setFocusDuration(preset);
                }}
                className={cn(
                  'rounded-full px-3 py-1.5',
                  defaultFocusMinutes === preset
                    ? 'bg-primary'
                    : 'bg-surface-elevated dark:bg-surface-elevated-dark',
                )}
              >
                <Text
                  className={cn(
                    'text-xs font-semibold',
                    defaultFocusMinutes === preset
                      ? 'text-white'
                      : 'text-ink dark:text-ink-dark',
                  )}
                >
                  {preset}m
                </Text>
              </Pressable>
            ))}
          </View>
        </Card>

        <Text className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-secondary dark:text-ink-dark-secondary">
          Developer
        </Text>
        <Card>
          <Text className="text-base font-semibold text-ink dark:text-ink-dark">API mode</Text>
          <Text className="mt-1 text-sm text-ink-secondary dark:text-ink-dark-secondary">
            {API_CONFIG.useMock
              ? 'Using local mock services (MMKV). Set EXPO_PUBLIC_USE_MOCK_API=false to call the backend.'
              : `Live API · ${API_CONFIG.baseUrl}`}
          </Text>
        </Card>
      </Animated.View>
    </Screen>
  );
}
