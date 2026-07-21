import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { Screen } from '@/components/common';
import { AppTextInput } from '@/components/inputs';
import { AuthHeader } from '../components/AuthHeader';
import { useForgotPasswordMutation } from '../hooks/useAuthMutations';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../validation/schemas';
import { useAuthStore } from '../store/auth-store';
import { MOCK_AUTH_OTP } from '../services/auth-service';

interface ForgotPasswordScreenProps {
  onSuccess: () => void;
  onBack: () => void;
}

export function AuthForgotPasswordScreen({ onSuccess, onBack }: ForgotPasswordScreenProps) {
  const clearError = useAuthStore((s) => s.clearError);
  const storeError = useAuthStore((s) => s.error);
  const mutation = useForgotPasswordMutation();

  const { control, handleSubmit } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    clearError();
    try {
      await mutation.mutateAsync(values.email);
      onSuccess();
    } catch {
      // store error
    }
  });

  return (
    <Screen scroll>
      <Animated.View entering={FadeInDown.duration(420)}>
        <AuthHeader
          title="Reset password"
          subtitle="Enter your email and we’ll send a 6-digit verification code."
          showBrand={false}
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
              containerClassName="mb-4"
            />
          )}
        />

        <Text className="mb-5 text-sm text-ink-muted">
          Demo tip: use code <Text className="font-semibold text-primary">{MOCK_AUTH_OTP}</Text>
        </Text>

        {storeError ? <Text className="mb-3 text-sm text-danger">{storeError}</Text> : null}

        <View className="gap-3">
          <PrimaryButton label="Send code" loading={mutation.isPending} onPress={onSubmit} />
          <SecondaryButton label="Back to sign in" onPress={onBack} />
        </View>
      </Animated.View>
    </Screen>
  );
}
