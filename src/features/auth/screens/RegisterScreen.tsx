import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PrimaryButton } from '@/components/buttons';
import { Screen } from '@/components/common';
import { AppTextInput } from '@/components/inputs';
import { AuthHeader } from '../components/AuthHeader';
import { useRegisterMutation } from '../hooks/useAuthMutations';
import { registerSchema, type RegisterFormValues } from '../validation/schemas';
import { useAuthStore } from '../store/auth-store';

interface RegisterScreenProps {
  onSuccess: () => void;
  onLogin: () => void;
}

export function AuthRegisterScreen({ onSuccess, onLogin }: RegisterScreenProps) {
  const clearError = useAuthStore((s) => s.clearError);
  const storeError = useAuthStore((s) => s.error);
  const registerMutation = useRegisterMutation();

  const { control, handleSubmit } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    clearError();
    try {
      await registerMutation.mutateAsync(values);
      onSuccess();
    } catch {
      // store error
    }
  });

  return (
    <Screen scroll>
      <Animated.View entering={FadeInDown.duration(420)}>
        <AuthHeader
          title="Create account"
          subtitle="Set up your workspace in under a minute."
        />

        <View className="mb-4 gap-3">
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <AppTextInput
                label="Full name"
                placeholder="Alex Morgan"
                leftIcon="person-outline"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
              />
            )}
          />
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
                placeholder="Create a password"
                secureTextEntry
                leftIcon="lock-closed-outline"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
                hint="Min 8 chars, 1 uppercase, 1 number"
              />
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <AppTextInput
                label="Confirm password"
                placeholder="Repeat your password"
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

        {storeError ? <Text className="mb-3 text-sm text-danger">{storeError}</Text> : null}

        <PrimaryButton
          label="Create account"
          loading={registerMutation.isPending}
          onPress={onSubmit}
        />

        <Pressable onPress={onLogin} className="mt-6 items-center">
          <Text className="text-sm text-ink-secondary dark:text-ink-dark-secondary">
            Already have an account? <Text className="font-semibold text-primary">Sign in</Text>
          </Text>
        </Pressable>
      </Animated.View>
    </Screen>
  );
}
