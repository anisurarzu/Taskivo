import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { Screen } from '@/components/common';
import { AppTextInput } from '@/components/inputs';
import { AuthHeader } from '../components/AuthHeader';
import { AuthSuccess } from '../components/AuthSuccess';
import { useResetPasswordMutation } from '../hooks/useAuthMutations';
import { resetPasswordSchema, type ResetPasswordFormValues } from '../validation/schemas';
import { useAuthStore } from '../store/auth-store';
import { useState } from 'react';

interface ResetPasswordScreenProps {
  onSuccess: () => void;
  onBack: () => void;
}

export function ResetPasswordScreen({ onSuccess, onBack }: ResetPasswordScreenProps) {
  const [done, setDone] = useState(false);
  const storeError = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);
  const mutation = useResetPasswordMutation();

  const { control, handleSubmit } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    clearError();
    try {
      await mutation.mutateAsync(values);
      setDone(true);
    } catch {
      // store error
    }
  });

  if (done) {
    return (
      <Screen scroll>
        <AuthSuccess
          title="Password updated"
          description="Your password has been reset successfully. You’re signed in and ready to go."
          primaryLabel="Go to home"
          onPrimary={onSuccess}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Animated.View entering={FadeInDown.duration(420)}>
        <AuthHeader
          title="Create new password"
          subtitle="Choose a strong password you haven’t used before."
          showBrand={false}
        />

        <View className="mb-6 gap-4">
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <AppTextInput
                label="New password"
                placeholder="Create a password"
                secureTextEntry
                leftIcon="lock-closed-outline"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
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

        <View className="gap-3">
          <PrimaryButton
            label="Update password"
            loading={mutation.isPending}
            onPress={onSubmit}
          />
          <SecondaryButton label="Back" onPress={onBack} />
        </View>
      </Animated.View>
    </Screen>
  );
}
