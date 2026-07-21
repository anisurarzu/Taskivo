import { ActivityIndicator, Text, View } from 'react-native';
import { cn } from '@/utils/cn';
import { colors } from '@/theme/colors';

interface LoadingProps {
  label?: string;
  fullScreen?: boolean;
  className?: string;
}

export function Loading({ label = 'Loading...', fullScreen = false, className }: LoadingProps) {
  return (
    <View
      className={cn(
        'items-center justify-center',
        fullScreen ? 'flex-1 bg-background dark:bg-background-dark' : 'py-8',
        className,
      )}
    >
      <ActivityIndicator size="large" color={colors.primary} />
      {label ? (
        <Text className="mt-3 text-sm text-ink-secondary dark:text-ink-dark-secondary">
          {label}
        </Text>
      ) : null}
    </View>
  );
}
