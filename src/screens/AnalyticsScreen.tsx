import { Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Screen } from '@/components/common';
import { Card, StatGrid } from '@/components/cards';
import { Loading, SectionHeader } from '@/components/ui';
import { useAnalytics } from '@/features/analytics';

export function AnalyticsScreen() {
  const { stats, weekBars, insights, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <Screen tabBar>
        <Loading fullScreen label="Loading insights..." />
      </Screen>
    );
  }

  return (
    <Screen scroll tabBar>
      <Animated.View entering={FadeInDown.duration(400)} className="pt-2">
        <Text className="mb-1 text-3xl font-bold text-ink dark:text-ink-dark">Analytics</Text>
        <Text className="mb-6 text-base text-ink-secondary dark:text-ink-dark-secondary">
          Built from your tasks and focus sessions
        </Text>

        <StatGrid stats={stats} />

        <Animated.View entering={FadeInUp.delay(100).duration(450)}>
          <SectionHeader title="Weekly completion" subtitle="Last 7 days" />
          <Card className="mb-6">
            <View className="h-40 flex-row items-end justify-between px-1">
              {weekBars.map((bar, index) => (
                <View key={`${bar.label}-${index}`} className="min-w-0 flex-1 items-center px-0.5">
                  <View
                    className="mb-2 w-full max-w-[28px] rounded-md bg-primary"
                    style={{ height: `${bar.value}%` }}
                  />
                  <Text className="text-xs font-medium text-ink-secondary dark:text-ink-dark-secondary">
                    {bar.label}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </Animated.View>

        <SectionHeader title="Productivity insights" />
        <Card padded={false}>
          {insights.map((item, index, arr) => (
            <View
              key={item.title}
              className={`flex-row items-center justify-between px-4 py-3.5 ${
                index < arr.length - 1 ? 'border-b border-border dark:border-border-dark' : ''
              }`}
            >
              <Text className="text-sm text-ink-secondary dark:text-ink-dark-secondary">
                {item.title}
              </Text>
              <Text className="text-sm font-semibold text-ink dark:text-ink-dark">{item.value}</Text>
            </View>
          ))}
        </Card>
      </Animated.View>
    </Screen>
  );
}
