import { Switch, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Screen } from '@/components/common';
import { Card } from '@/components/cards';
import { IconButton } from '@/components/buttons';
import { useThemeStore } from '@/store';
import { colors } from '@/theme/colors';

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { preference, setPreference } = useThemeStore();
  const isDark = preference === 'dark';
  const isSystem = preference === 'system';

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
            <View className="flex-1 pr-4">
              <Text className="text-base font-semibold text-ink dark:text-ink-dark">Dark mode</Text>
              <Text className="mt-0.5 text-sm text-ink-secondary dark:text-ink-dark-secondary">
                Use a darker color palette
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={(value) => setPreference(value ? 'dark' : 'light')}
              trackColor={{ false: '#E2E8F0', true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View className="flex-row items-center justify-between border-t border-border/60 pt-4 dark:border-border-dark">
            <View className="flex-1 pr-4">
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
              trackColor={{ false: '#E2E8F0', true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>

        <Text className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-secondary dark:text-ink-dark-secondary">
          General
        </Text>
        <Card>
          {[
            { title: 'Haptic feedback', value: 'On' },
            { title: 'Start of week', value: 'Monday' },
            { title: 'Default focus', value: '25 min' },
            { title: 'Language', value: 'English' },
          ].map((item, index, arr) => (
            <View
              key={item.title}
              className={`flex-row items-center justify-between py-3.5 ${
                index < arr.length - 1 ? 'border-b border-border/60 dark:border-border-dark' : ''
              }`}
            >
              <Text className="text-base text-ink dark:text-ink-dark">{item.title}</Text>
              <Text className="text-sm text-ink-secondary dark:text-ink-dark-secondary">
                {item.value}
              </Text>
            </View>
          ))}
        </Card>
      </Animated.View>
    </Screen>
  );
}
