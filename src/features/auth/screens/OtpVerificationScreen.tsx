import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { AuthShell } from '../components/AuthShell';
import { AuthHeader } from '../components/AuthHeader';
import { AuthErrorBanner } from '../components/AuthErrorBanner';
import { OtpInput } from '../components/OtpInput';
import { AuthSuccess } from '../components/AuthSuccess';
import { useVerifyOtpMutation } from '../hooks/useAuthMutations';
import { otpSchema, type OtpFormValues } from '../validation/schemas';
import { useAuthStore } from '../store/auth-store';
import { MOCK_AUTH_OTP } from '../services/auth-service';
import { useState } from 'react';

interface OtpVerificationScreenProps {
  onResetContinue: () => void;
  onAuthenticated: () => void;
  onBack: () => void;
}

export function OtpVerificationScreen({
  onResetContinue,
  onAuthenticated,
  onBack,
}: OtpVerificationScreenProps) {
  const [registered, setRegistered] = useState(false);
  const email = useAuthStore((s) => s.flowEmail);
  const purpose = useAuthStore((s) => s.flowPurpose);
  const storeError = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);
  const mutation = useVerifyOtpMutation();

  const { control, handleSubmit } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    clearError();
    try {
      const result = await mutation.mutateAsync(values.otp);
      if (result === 'authenticated') {
        setRegistered(true);
      } else {
        onResetContinue();
      }
    } catch {
      // store
    }
  });

  if (registered) {
    return (
      <AuthShell>
        <AuthSuccess
          title="You’re verified"
          description="Your email is confirmed and your Taskivo account is ready."
          primaryLabel="Go to home"
          onPrimary={onAuthenticated}
        />
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <Animated.View entering={FadeInDown.duration(380).springify().damping(18)}>
        <AuthHeader
          title="Enter code"
          subtitle={`We sent a 6-digit code to ${email ?? 'your email'}${
            purpose === 'register' ? ' to finish signup' : ''
          }.`}
          showBrand={false}
        />

        <Controller
          control={control}
          name="otp"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <View className="mb-4">
              <OtpInput value={value} onChange={onChange} error={Boolean(error || storeError)} />
              {error ? <Text className="mt-2 text-[13px] text-danger">{error.message}</Text> : null}
            </View>
          )}
        />

        <Text className="mb-6 text-[15px] text-ink-muted">
          Demo code: <Text className="font-semibold text-primary">{MOCK_AUTH_OTP}</Text>
        </Text>

        {storeError ? <AuthErrorBanner message={storeError} /> : null}

        <View className="gap-3.5">
          <PrimaryButton
            size="lg"
            label="Verify code"
            loading={mutation.isPending}
            onPress={onSubmit}
          />
          <SecondaryButton size="lg" label="Back" onPress={onBack} />
        </View>
      </Animated.View>
    </AuthShell>
  );
}
