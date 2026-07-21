import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '@/components/buttons';
import { Screen } from '@/components/common';
import { AppTextInput } from '@/components/inputs';
import { colors } from '@/theme/colors';
import { AuthHeader } from '../components/AuthHeader';
import { SocialAuthButtons } from '../components/SocialAuthButtons';
import { useLoginMutation } from '../hooks/useAuthMutations';
import { loginSchema, type LoginFormValues } from '../validation/schemas';
import { useAuthStore } from '../store/auth-store';
import { cn } from '@/utils/cn';

interface LoginScreenProps {
  onSuccess: () => void;
  onRegister: () => void;
  onForgotPassword: () => void;
}

export function AuthLoginScreen({ onSuccess, onRegister, onForgotPassword }: LoginScreenProps) {
  const clearError = useAuthStore((s) => s.clearError);
  const storeError = useAuthStore((s) => s.error);
  const loginMutation = useLoginMutation();

  const { control, handleSubmit, setValue, watch } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: true },
  });

  const rememberMe = watch('rememberMe');

  const onSubmit = handleSubmit(async (values) => {
    clearError();
    try {
      await loginMutation.mutateAsync(values);
      onSuccess();
    } catch {
      // error surfaced via store
    }
  });

  return (
    <Screen scroll>
      <Animated.View entering={FadeInDown.duration(380)}>
        <AuthHeader
          title="Welcome back"
          subtitle="Sign in to continue where you left off."
        />

        <View className="gap-3">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <AppTextInput
                label="Email"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon="mail-outline"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <AppTextInput
                label="Password"
                placeholder="Your password"
                secureTextEntry
                leftIcon="lock-closed-outline"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
              />
            )}
          />
        </View>

        <View className="mb-4 mt-3.5 flex-row items-center justify-between">
          <Pressable
            onPress={() => setValue('rememberMe', !rememberMe)}
            className="flex-row items-center"
            hitSlop={6}
          >
            <View
              className={cn(
                'mr-2 h-4 w-4 items-center justify-center rounded border',
                rememberMe ? 'border-primary bg-primary' : 'border-border dark:border-border-dark',
              )}
            >
              {rememberMe ? <Ionicons name="checkmark" size={10} color="#FFFFFF" /> : null}
            </View>
            <Text className="text-xs text-ink-secondary dark:text-ink-dark-secondary">
              Remember me
            </Text>
          </Pressable>
          <Pressable onPress={onForgotPassword} hitSlop={6}>
            <Text className="text-xs font-semibold text-primary">Forgot password?</Text>
          </Pressable>
        </View>

        {storeError ? <Text className="mb-2.5 text-xs text-danger">{storeError}</Text> : null}

        <PrimaryButton
          label="Sign in"
          loading={loginMutation.isPending}
          onPress={onSubmit}
        />

        <View className="my-4 flex-row items-center">
          <View className="h-px flex-1 bg-border dark:bg-border-dark" />
          <Text className="mx-2.5 text-xs text-ink-muted">or continue with</Text>
          <View className="h-px flex-1 bg-border dark:bg-border-dark" />
        </View>

        <SocialAuthButtons onError={(message) => useAuthStore.setState({ error: message })} />

        <Pressable onPress={onRegister} className="mt-5 items-center">
          <Text className="text-xs text-ink-secondary dark:text-ink-dark-secondary">
            New to Taskivo? <Text className="font-semibold text-primary">Create account</Text>
          </Text>
        </Pressable>
      </Animated.View>
    </Screen>
  );
}
