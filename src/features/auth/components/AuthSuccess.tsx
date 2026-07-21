import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { colors } from '@/theme/colors';

interface AuthSuccessProps {
  title: string;
  description: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

export function AuthSuccess({
  title,
  description,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: AuthSuccessProps) {
  return (
    <View className="flex-1 items-center justify-center px-2 py-10">
      <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-primary/15">
        <Ionicons name="checkmark-circle" size={48} color={colors.primary} />
      </View>
      <Text className="mb-2 text-center text-2xl font-bold text-ink dark:text-ink-dark">
        {title}
      </Text>
      <Text className="mb-8 text-center text-base leading-6 text-ink-secondary dark:text-ink-dark-secondary">
        {description}
      </Text>
      <View className="w-full gap-3">
        <PrimaryButton label={primaryLabel} onPress={onPrimary} />
        {secondaryLabel && onSecondary ? (
          <SecondaryButton label={secondaryLabel} onPress={onSecondary} />
        ) : null}
      </View>
    </View>
  );
}
