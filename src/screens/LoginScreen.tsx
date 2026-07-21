import { Controller, useForm } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { Screen } from '@/components/common';
import { AppTextInput } from '@/components/inputs';
import { APP_NAME, APP_TAGLINE } from '@/constants';

interface LoginForm {
  email: string;
  password: string;
}

interface LoginScreenProps {
  onLogin: () => void;
  onRegister: () => void;
  onForgotPassword: () => void;
}

export function LoginScreen({ onLogin, onRegister, onForgotPassword }: LoginScreenProps) {
  const { control, handleSubmit } = useForm<LoginForm>({
    defaultValues: { email: '', password: '' },
  });

  return (
    <Screen scroll>
      <Animated.View entering={FadeInDown.duration(450)} className="pt-8">
        <Text className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
          {APP_NAME}
        </Text>
        <Text className="mb-2 text-3xl font-bold text-ink dark:text-ink-dark">Welcome back</Text>
        <Text className="mb-8 text-base text-ink-secondary dark:text-ink-dark-secondary">
          {APP_TAGLINE}
        </Text>

        <View className="gap-4">
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
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            rules={{ required: 'Password is required' }}
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

        <Pressable onPress={onForgotPassword} className="mb-6 mt-3 self-end">
          <Text className="text-sm font-semibold text-primary">Forgot password?</Text>
        </Pressable>

        <PrimaryButton label="Sign in" onPress={handleSubmit(onLogin)} />
        <View className="my-5 flex-row items-center">
          <View className="h-px flex-1 bg-border dark:bg-border-dark" />
          <Text className="mx-3 text-sm text-ink-secondary">or</Text>
          <View className="h-px flex-1 bg-border dark:bg-border-dark" />
        </View>
        <SecondaryButton label="Create an account" onPress={onRegister} />
      </Animated.View>
    </Screen>
  );
}
