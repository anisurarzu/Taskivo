import { Pressable, Text, View } from 'react-native';
import { cn } from '@/utils/cn';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
  className,
}: SectionHeaderProps) {
  return (
    <View className={cn('mb-3 flex-row items-end justify-between', className)}>
      <View className="flex-1 pr-4">
        <Text className="text-lg font-bold text-ink dark:text-ink-dark">{title}</Text>
        {subtitle ? (
          <Text className="mt-0.5 text-sm text-ink-secondary dark:text-ink-dark-secondary">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text className="text-sm font-semibold text-primary">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
