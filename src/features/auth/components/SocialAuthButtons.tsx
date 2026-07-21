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

  const providers = [
    { key: 'google', icon: 'logo-google' as const, label: 'Google', action: () => google.mutateAsync() },
    { key: 'apple', icon: 'logo-apple' as const, label: 'Apple', action: () => apple.mutateAsync() },
    {
      key: 'bio',
      icon: 'finger-print-outline' as const,
      label: 'Biometric',
      action: () => biometric.mutateAsync(),
      tint: colors.primary,
    },
  ];

  return (
    <View className="flex-row gap-2.5">
      {providers.map((provider) => (
        <Pressable
          key={provider.key}
          onPress={() => handle(provider.action)}
          className="h-10 min-w-0 flex-1 flex-row items-center justify-center rounded-lg border border-border bg-card dark:border-border-dark dark:bg-card-dark"
        >
          <Ionicons
            name={provider.icon}
            size={16}
            color={provider.tint ?? colors.text}
          />
          <Text className="ml-1.5 text-xs font-semibold text-ink dark:text-ink-dark">
            {provider.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
