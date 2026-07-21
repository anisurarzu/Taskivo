import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';
import type { StatItem } from '@/types';
import { cn } from '@/utils/cn';

interface StatCardProps {
  stat: StatItem;
  className?: string;
}

export function StatCard({ stat, className }: StatCardProps) {
  const trendIcon =
    stat.trend === 'up' ? 'trending-up' : stat.trend === 'down' ? 'trending-down' : 'remove';

  return (
    <Card className={cn('min-w-[46%] flex-1', className)}>
      <View className="mb-3 flex-row items-center justify-between">
        <View
          className="h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${stat.color ?? '#4F46E5'}18` }}
        >
          <Ionicons
            name={(stat.icon as keyof typeof Ionicons.glyphMap) ?? 'analytics-outline'}
            size={18}
            color={stat.color ?? '#4F46E5'}
          />
        </View>
        {stat.change ? (
          <View className="flex-row items-center">
            <Ionicons
              name={trendIcon}
              size={14}
              color={stat.trend === 'down' ? '#EF4444' : '#22C55E'}
            />
            <Text className="ml-1 text-xs font-medium text-success">{stat.change}</Text>
          </View>
        ) : null}
      </View>
      <Text className="text-2xl font-bold text-ink dark:text-ink-dark">{stat.value}</Text>
      <Text className="mt-1 text-sm text-ink-secondary dark:text-ink-dark-secondary">
        {stat.label}
      </Text>
    </Card>
  );
}
