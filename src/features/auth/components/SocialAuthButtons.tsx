import { Pressable, View } from 'react-native';
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

  const providers = [
    { key: 'google', icon: 'logo-google' as const, action: () => google.mutateAsync() },
    { key: 'apple', icon: 'logo-apple' as const, action: () => apple.mutateAsync() },
    {
      key: 'bio',
      icon: 'finger-print-outline' as const,
      action: () => biometric.mutateAsync(),
      tint: colors.primary,
    },
  ];

  return (
    <View className="flex-row justify-center gap-3">
      {providers.map((provider) => (
        <Pressable
          key={provider.key}
          onPress={() => handle(provider.action)}
          className="h-12 w-12 items-center justify-center rounded-full border border-border bg-card dark:border-border-dark dark:bg-card-dark"
        >
          <Ionicons name={provider.icon} size={18} color={provider.tint ?? colors.text} />
        </Pressable>
      ))}
    </View>
  );
}
