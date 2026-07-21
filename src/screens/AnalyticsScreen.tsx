import { Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Screen } from '@/components/common';
import { Card, StatCard } from '@/components/cards';
import { SectionHeader } from '@/components/ui';
import { mockStats } from '@/data/mock';

const weekBars = [42, 65, 48, 80, 55, 72, 90];
const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function AnalyticsScreen() {
  return (
    <Screen scroll>
      <Animated.View entering={FadeInDown.duration(400)} className="pt-2">
        <Text className="mb-1 text-3xl font-bold text-ink dark:text-ink-dark">Analytics</Text>
        <Text className="mb-6 text-base text-ink-secondary dark:text-ink-dark-secondary">
          Understand how you work
        </Text>

        <View className="mb-6 flex-row flex-wrap gap-3">
          {mockStats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </View>

        <Animated.View entering={FadeInUp.delay(100).duration(450)}>
          <SectionHeader title="Weekly completion" subtitle="Last 7 days" />
          <Card className="mb-6">
            <View className="h-40 flex-row items-end justify-between">
              {weekBars.map((value, index) => (
                <View key={`${days[index]}-${index}`} className="items-center">
                  <View
                    className="mb-2 w-7 rounded-md bg-primary"
                    style={{ height: `${value}%` }}
                  />
                  <Text className="text-xs font-medium text-ink-secondary dark:text-ink-dark-secondary">
                    {days[index]}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </Animated.View>

        <SectionHeader title="Productivity insights" />
        <Card>
          {[
            { title: 'Peak focus hours', value: '9–11 AM' },
            { title: 'Most productive day', value: 'Thursday' },
            { title: 'Avg. tasks / day', value: '6.4' },
          ].map((item, index, arr) => (
            <View
              key={item.title}
              className={`flex-row items-center justify-between py-3 ${
                index < arr.length - 1 ? 'border-b border-border/60 dark:border-border-dark' : ''
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
