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
    <View className="mb-3 rounded-card border border-border/70 bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
      <View className="mb-3 flex-row items-center justify-between">
        <Skeleton width={64} height={22} rounded="full" />
        <Skeleton width={48} height={14} />
      </View>
      <Skeleton height={18} className="mb-2" />
      <Skeleton width="40%" height={14} />
    </View>
  );
}
