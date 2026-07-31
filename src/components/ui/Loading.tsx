import { ActivityIndicator, Text, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { cn } from '@/utils/cn';
import { colors } from '@/theme/colors';

interface LoadingProps {
  label?: string;
  fullScreen?: boolean;
  className?: string;
}

export function Loading({ label = 'Loading...', fullScreen = false, className }: LoadingProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(180)}
      className={cn(
        'items-center justify-center',
        fullScreen ? 'flex-1 bg-background dark:bg-background-dark' : 'py-8',
        className,
      )}
    >
      <Animated.View
        entering={ZoomIn.springify().damping(16)}
        className="h-14 w-14 items-center justify-center rounded-2xl bg-primary/10"
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </Animated.View>
      {label ? (
        <Text className="mt-3 text-sm text-ink-secondary dark:text-ink-dark-secondary">
          {label}
        </Text>
      ) : null}
    </Animated.View>
  );
}
