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
    <View className="flex-1 items-center justify-center py-6">
      <View className="mb-6 h-20 w-20 items-center justify-center rounded-3xl bg-primary/12">
        <Ionicons name="checkmark-circle" size={40} color={colors.primary} />
      </View>
      <Text className="mb-2 text-center text-[32px] font-bold leading-10 tracking-tight text-ink dark:text-ink-dark">
        {title}
      </Text>
      <Text className="mb-10 text-center text-[16px] leading-6 text-ink-secondary dark:text-ink-dark-secondary">
        {description}
      </Text>
      <View className="w-full gap-3.5">
        <PrimaryButton size="lg" label={primaryLabel} onPress={onPrimary} />
        {secondaryLabel && onSecondary ? (
          <SecondaryButton size="lg" label={secondaryLabel} onPress={onSecondary} />
        ) : null}
      </View>
    </View>
  );
}
