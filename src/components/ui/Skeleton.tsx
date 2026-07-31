import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
  width?: number | `${number}%`;
  height?: number;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Skeleton({
  className,
  width = '100%',
  height = 16,
  rounded = 'md',
}: SkeletonProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1100 }), -1, true);
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0.35, 0.85]),
  }));

  const radiusClass =
    rounded === 'full'
      ? 'rounded-full'
      : rounded === 'xl'
        ? 'rounded-xl'
        : rounded === 'lg'
          ? 'rounded-lg'
          : rounded === 'sm'
            ? 'rounded-sm'
            : 'rounded-md';

  return (
    <Animated.View
      style={[{ width, height }, animatedStyle]}
      className={cn('bg-border dark:bg-border-dark', radiusClass, className)}
    />
  );
}

export function TaskSkeleton() {
  return (
    <View className="mb-3 rounded-xl border border-border/70 bg-card p-4 dark:border-border-dark dark:bg-card-dark">
      <View className="mb-3 flex-row items-center justify-between">
        <Skeleton width={72} height={24} rounded="full" />
        <Skeleton width={56} height={16} />
      </View>
      <Skeleton height={20} className="mb-2.5" />
      <Skeleton width="55%" height={16} className="mb-3" />
      <Skeleton height={8} rounded="full" />
    </View>
  );
}

export function ListRowSkeleton() {
  return (
    <View className="mb-3 flex-row items-center rounded-xl border border-border/70 bg-card p-4 dark:border-border-dark dark:bg-card-dark">
      <Skeleton width={48} height={48} rounded="xl" />
      <View className="ml-3.5 flex-1">
        <Skeleton height={18} className="mb-2" width="70%" />
        <Skeleton height={14} width="45%" />
      </View>
    </View>
  );
}

/** Full-page skeleton for org / team detail — sits in normal content flow */
export function DetailScreenSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <View className="pt-2">
      <View className="mb-5 flex-row items-center justify-between">
        <Skeleton width={40} height={40} rounded="full" />
        <View className="flex-row gap-2">
          <Skeleton width={40} height={40} rounded="full" />
          <Skeleton width={40} height={40} rounded="full" />
        </View>
      </View>
      <Skeleton height={30} width="65%" className="mb-2.5" />
      <Skeleton height={18} width="85%" className="mb-5" />
      <Skeleton height={52} rounded="xl" className="mb-6" />
      <Skeleton height={20} width="40%" className="mb-3" />
      {Array.from({ length: rows }).map((_, i) => (
        <ListRowSkeleton key={i} />
      ))}
    </View>
  );
}

export function BudgetCardSkeleton() {
  return (
    <View className="mb-3 rounded-xl border border-border/70 bg-card p-4 dark:border-border-dark dark:bg-card-dark">
      <View className="mb-3 flex-row items-center">
        <Skeleton width={48} height={48} rounded="xl" />
        <View className="ml-3.5 flex-1">
          <Skeleton height={18} width="60%" className="mb-2" />
          <Skeleton height={14} width="40%" />
        </View>
      </View>
      <Skeleton height={8} rounded="full" />
    </View>
  );
}
