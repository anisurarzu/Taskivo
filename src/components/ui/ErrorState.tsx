import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { cn } from '@/utils/cn';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  onSecondary?: () => void;
  secondaryLabel?: string;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We couldn’t load this content. Please try again.',
  onRetry,
  onSecondary,
  secondaryLabel = 'Go back',
  className,
}: ErrorStateProps) {
  return (
    <View className={cn('items-center justify-center px-8 py-12', className)}>
      <View className="mb-5 h-16 w-16 items-center justify-center rounded-2xl bg-danger/10">
        <Ionicons name="alert-circle-outline" size={28} color="#EF4444" />
      </View>
      <Text className="mb-2 text-center text-xl font-bold text-ink dark:text-ink-dark">
        {title}
      </Text>
      <Text className="mb-6 text-center text-base text-ink-secondary dark:text-ink-dark-secondary">
        {description}
      </Text>
      <View className="w-full gap-3">
        {onRetry ? <PrimaryButton label="Try again" onPress={onRetry} /> : null}
        {onSecondary ? (
          <SecondaryButton label={secondaryLabel} onPress={onSecondary} />
        ) : null}
      </View>
    </View>
  );
}
