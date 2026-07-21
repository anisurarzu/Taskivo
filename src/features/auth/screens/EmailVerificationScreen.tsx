import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { Screen } from '@/components/common';
import { colors } from '@/theme/colors';
import { useAuthStore } from '../store/auth-store';

interface EmailVerificationScreenProps {
  onContinue: () => void;
  onBack: () => void;
}

export function EmailVerificationScreen({ onContinue, onBack }: EmailVerificationScreenProps) {
  const email = useAuthStore((s) => s.flowEmail);
  const markEmailVerified = useAuthStore((s) => s.markEmailVerified);

  return (
    <Screen scroll>
      <Animated.View entering={FadeInDown.duration(420)} className="items-center pt-10">
        <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-primary/15">
          <Ionicons name="mail-open-outline" size={36} color={colors.primary} />
        </View>
        <Text className="mb-2 text-center text-3xl font-bold text-ink dark:text-ink-dark">
          Check your email
        </Text>
        <Text className="mb-2 text-center text-base leading-6 text-ink-secondary dark:text-ink-dark-secondary">
          We sent a verification link to
        </Text>
        <Text className="mb-8 text-center text-base font-semibold text-ink dark:text-ink-dark">
          {email ?? 'your inbox'}
        </Text>

        <View className="w-full gap-3">
          <PrimaryButton
            label="I’ve verified my email"
            onPress={() => {
              markEmailVerified();
              onContinue();
            }}
          />
          <SecondaryButton label="Back" onPress={onBack} />
        </View>
      </Animated.View>
    </Screen>
  );
}
