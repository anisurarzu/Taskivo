import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pressable, Switch, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PrimaryButton } from '@/components/buttons';
import { Screen } from '@/components/common';
import { AppTextInput } from '@/components/inputs';
import { colors } from '@/theme/colors';
import { AuthHeader } from '../components/AuthHeader';
import { SocialAuthButtons } from '../components/SocialAuthButtons';
import { useLoginMutation } from '../hooks/useAuthMutations';
import { loginSchema, type LoginFormValues } from '../validation/schemas';
import { useAuthStore } from '../store/auth-store';

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
      <Animated.View entering={FadeInDown.duration(420)}>
        <AuthHeader
          title="Welcome back"
          subtitle="Sign in to continue organizing your life smarter."
        />

        <View className="gap-4">
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
                placeholder="Enter your password"
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

        <View className="mb-5 mt-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Switch
              value={Boolean(rememberMe)}
              onValueChange={(v) => setValue('rememberMe', v)}
              trackColor={{ false: '#E5E7EB', true: colors.primary }}
              thumbColor="#FFFFFF"
            />
            <Text className="ml-2 text-sm text-ink-secondary dark:text-ink-dark-secondary">
              Remember me
            </Text>
          </View>
          <Pressable onPress={onForgotPassword}>
            <Text className="text-sm font-semibold text-primary">Forgot password?</Text>
          </Pressable>
        </View>

        {storeError ? (
          <Text className="mb-3 text-sm text-danger">{storeError}</Text>
        ) : null}

        <PrimaryButton
          label="Sign in"
          loading={loginMutation.isPending}
          onPress={onSubmit}
        />

        <View className="my-5 flex-row items-center">
          <View className="h-px flex-1 bg-border dark:bg-border-dark" />
          <Text className="mx-3 text-sm text-ink-secondary">or</Text>
          <View className="h-px flex-1 bg-border dark:bg-border-dark" />
        </View>

        <SocialAuthButtons onError={(message) => useAuthStore.setState({ error: message })} />

        <Pressable onPress={onRegister} className="mt-6 items-center">
          <Text className="text-sm text-ink-secondary dark:text-ink-dark-secondary">
            New to Taskivo? <Text className="font-semibold text-primary">Create account</Text>
          </Text>
        </Pressable>
      </Animated.View>
    </Screen>
  );
}
