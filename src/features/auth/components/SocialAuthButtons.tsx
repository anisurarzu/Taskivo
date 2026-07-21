import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks';
import { useSocialAuthPlaceholders } from '../hooks/useAuthMutations';

interface SocialAuthButtonsProps {
  onError?: (message: string) => void;
}

export function SocialAuthButtons({ onError }: SocialAuthButtonsProps) {
  const colors = useThemeColors();
  const { google, apple, biometric } = useSocialAuthPlaceholders();

  const handle = async (fn: () => Promise<unknown>) => {
    try {
      await fn();
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  return (
    <View className="gap-3">
      <Pressable
        onPress={() => handle(() => google.mutateAsync())}
        className="h-12 flex-row items-center justify-center rounded-xl border border-border bg-card dark:border-border-dark dark:bg-card-dark"
      >
        <Ionicons name="logo-google" size={18} color={colors.text} />
        <Text className="ml-2 text-sm font-semibold text-ink dark:text-ink-dark">
          Continue with Google
        </Text>
      </Pressable>
      <Pressable
        onPress={() => handle(() => apple.mutateAsync())}
        className="h-12 flex-row items-center justify-center rounded-xl border border-border bg-card dark:border-border-dark dark:bg-card-dark"
      >
        <Ionicons name="logo-apple" size={18} color={colors.text} />
        <Text className="ml-2 text-sm font-semibold text-ink dark:text-ink-dark">
          Continue with Apple
        </Text>
      </Pressable>
      <Pressable
        onPress={() => handle(() => biometric.mutateAsync())}
        className="h-12 flex-row items-center justify-center rounded-xl border border-border bg-card dark:border-border-dark dark:bg-card-dark"
      >
        <Ionicons name="finger-print-outline" size={18} color={colors.primary} />
        <Text className="ml-2 text-sm font-semibold text-ink dark:text-ink-dark">
          Use biometrics
        </Text>
      </Pressable>
    </View>
  );
}
