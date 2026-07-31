import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { AppTextInput } from '@/components/inputs';
import { AuthShell } from '../components/AuthShell';
import { AuthHeader } from '../components/AuthHeader';
import { AuthErrorBanner } from '../components/AuthErrorBanner';
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
      // store
    }
  });

  if (done) {
    return (
      <AuthShell>
        <AuthSuccess
          title="Password updated"
          description="Your password has been reset. You’re signed in and ready to go."
          primaryLabel="Go to home"
          onPrimary={onSuccess}
        />
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <Animated.View entering={FadeInDown.duration(380).springify().damping(18)}>
        <AuthHeader
          title="New password"
          subtitle="Choose a strong password you haven’t used before."
          showBrand={false}
        />

        <View className="mb-6 gap-5">
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <AppTextInput
                size="lg"
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

        <View className="gap-3.5">
          <PrimaryButton
            size="lg"
            label="Update password"
            loading={mutation.isPending}
            onPress={onSubmit}
          />
          <SecondaryButton size="lg" label="Back" onPress={onBack} />
        </View>
      </Animated.View>
    </AuthShell>
  );
}
