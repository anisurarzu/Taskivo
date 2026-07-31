import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { AuthShell } from '../components/AuthShell';
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
    <AuthShell>
      <Animated.View
        entering={FadeInDown.duration(380).springify().damping(18)}
        className="items-center"
      >
        <View className="mb-6 h-20 w-20 items-center justify-center rounded-3xl bg-primary/12">
          <Ionicons name="mail-open-outline" size={36} color={colors.primary} />
        </View>
        <Text className="mb-2 text-center text-[32px] font-bold leading-10 tracking-tight text-ink dark:text-ink-dark">
          Check your email
        </Text>
        <Text className="mb-1 text-center text-[16px] leading-6 text-ink-secondary dark:text-ink-dark-secondary">
          We sent a verification link to
        </Text>
        <Text className="mb-10 text-center text-[16px] font-semibold text-ink dark:text-ink-dark">
          {email ?? 'your inbox'}
        </Text>

        <View className="w-full gap-3.5">
          <PrimaryButton
            size="lg"
            label="I’ve verified my email"
            onPress={() => {
              markEmailVerified();
              onContinue();
            }}
          />
          <SecondaryButton size="lg" label="Back" onPress={onBack} />
        </View>
      </Animated.View>
    </AuthShell>
  );
}
