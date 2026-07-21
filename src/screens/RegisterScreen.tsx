import { Controller, useForm } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PrimaryButton } from '@/components/buttons';
import { Screen } from '@/components/common';
import { AppTextInput } from '@/components/inputs';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

interface RegisterScreenProps {
  onRegister: () => void;
  onLogin: () => void;
}

export function RegisterScreen({ onRegister, onLogin }: RegisterScreenProps) {
  const { control, handleSubmit } = useForm<RegisterForm>({
    defaultValues: { name: '', email: '', password: '' },
  });

  return (
    <Screen scroll>
      <Animated.View entering={FadeInDown.duration(450)} className="pt-8">
        <Text className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
          Taskivo
        </Text>
        <Text className="mb-2 text-3xl font-bold text-ink dark:text-ink-dark">Create account</Text>
        <Text className="mb-8 text-base text-ink-secondary dark:text-ink-dark-secondary">
          Start organizing your life in minutes.
        </Text>

        <View className="mb-6 gap-4">
          <Controller
            control={control}
            name="name"
            rules={{ required: 'Name is required' }}
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
            rules={{ required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } }}
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
                hint="At least 8 characters"
              />
            )}
          />
        </View>

        <PrimaryButton label="Create account" onPress={handleSubmit(onRegister)} />

        <Pressable onPress={onLogin} className="mt-6 items-center">
          <Text className="text-sm text-ink-secondary dark:text-ink-dark-secondary">
            Already have an account?{' '}
            <Text className="font-semibold text-primary">Sign in</Text>
          </Text>
        </Pressable>
      </Animated.View>
    </Screen>
  );
}
