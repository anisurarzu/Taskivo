import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PrimaryButton } from '@/components/buttons';
import { AppTextInput } from '@/components/inputs';
import { AuthShell } from '../components/AuthShell';
import { AuthHeader } from '../components/AuthHeader';
import { AuthErrorBanner } from '../components/AuthErrorBanner';
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
      // store
    }
  });

  return (
    <AuthShell dense>
      <Animated.View entering={FadeInDown.duration(380).springify().damping(18)}>
        <AuthHeader
          title="Create account"
          subtitle="Set up your workspace in under a minute and stay in sync across web and mobile."
        />

        <View className="mb-6 gap-5">
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <AppTextInput
                size="lg"
                label="Full name"
                placeholder="Alex Morgan"
                leftIcon="person-outline"
                autoCapitalize="words"
                autoComplete="name"
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
                size="lg"
                label="Email"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
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
                size="lg"
                label="Password"
                placeholder="Create a password"
                secureTextEntry
                leftIcon="lock-closed-outline"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
                hint="At least 8 characters, 1 uppercase, 1 number"
              />
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <AppTextInput
                size="lg"
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

        {storeError ? <AuthErrorBanner message={storeError} /> : null}

        <PrimaryButton
          size="lg"
          label="Create account"
          loading={registerMutation.isPending}
          onPress={onSubmit}
        />

        <Pressable onPress={onLogin} className="mt-8 items-center py-2">
          <Text className="text-[15px] text-ink-secondary dark:text-ink-dark-secondary">
            Already have an account?{' '}
            <Text className="font-bold text-primary">Sign in</Text>
          </Text>
        </Pressable>
      </Animated.View>
    </AuthShell>
  );
}
