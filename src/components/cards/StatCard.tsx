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
  const trendColor =
    stat.trend === 'down' ? '#EF4444' : stat.trend === 'up' ? '#16A34A' : '#94A3B8';

  return (
    <Card className={cn('w-full', className)}>
      <View className="mb-3 flex-row items-center justify-between">
        <View
          className="h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${stat.color ?? '#16A34A'}18` }}
        >
          <Ionicons
            name={(stat.icon as keyof typeof Ionicons.glyphMap) ?? 'analytics-outline'}
            size={18}
            color={stat.color ?? '#16A34A'}
          />
        </View>
        {stat.change ? (
          <View className="flex-row items-center">
            <Ionicons name={trendIcon} size={14} color={trendColor} />
            <Text
              className={cn(
                'ml-1 text-xs font-medium',
                stat.trend === 'down' ? 'text-danger' : 'text-success',
              )}
            >
              {stat.change}
            </Text>
          </View>
        ) : null}
      </View>
      <Text className="text-2xl font-bold text-ink dark:text-ink-dark" numberOfLines={1}>
        {stat.value}
      </Text>
      <Text
        className="mt-1 text-sm text-ink-secondary dark:text-ink-dark-secondary"
        numberOfLines={1}
      >
        {stat.label}
      </Text>
    </Card>
  );
}
