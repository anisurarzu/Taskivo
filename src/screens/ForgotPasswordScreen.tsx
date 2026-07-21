import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { Screen } from '@/components/common';
import { AppTextInput } from '@/components/inputs';

interface ForgotForm {
  email: string;
}

interface ForgotPasswordScreenProps {
  onSubmit: () => void;
  onBack: () => void;
}

export function ForgotPasswordScreen({ onSubmit, onBack }: ForgotPasswordScreenProps) {
  const { control, handleSubmit } = useForm<ForgotForm>({
    defaultValues: { email: '' },
  });

  return (
    <Screen scroll>
      <Animated.View entering={FadeInDown.duration(450)} className="pt-8">
        <Text className="mb-2 text-3xl font-bold text-ink dark:text-ink-dark">Reset password</Text>
        <Text className="mb-8 text-base text-ink-secondary dark:text-ink-dark-secondary">
          Enter your email and we’ll send you a reset link.
        </Text>

        <Controller
          control={control}
          name="email"
          rules={{ required: 'Email is required' }}
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
              containerClassName="mb-6"
            />
          )}
        />

        <View className="gap-3">
          <PrimaryButton label="Send reset link" onPress={handleSubmit(onSubmit)} />
          <SecondaryButton label="Back to sign in" onPress={onBack} />
        </View>
      </Animated.View>
    </Screen>
  );
}
