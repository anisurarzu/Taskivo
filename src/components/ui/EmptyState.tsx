import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '@/components/buttons';
import { cn } from '@/utils/cn';
import { useThemeColors } from '@/hooks';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon = 'file-tray-outline',
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  const colors = useThemeColors();

  return (
    <View className={cn('items-center justify-center px-8 py-12', className)}>
      <View className="mb-5 h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <Ionicons name={icon} size={28} color={colors.primary} />
      </View>
      <Text className="mb-2 text-center text-xl font-bold text-ink dark:text-ink-dark">
        {title}
      </Text>
      {description ? (
        <Text className="mb-6 text-center text-base text-ink-secondary dark:text-ink-dark-secondary">
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <PrimaryButton label={actionLabel} onPress={onAction} fullWidth={false} className="px-8" />
      ) : null}
    </View>
  );
}
