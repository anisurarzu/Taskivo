import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { AppTextInput } from '@/components/inputs';
import { AuthShell } from '../components/AuthShell';
import { AuthHeader } from '../components/AuthHeader';
import { AuthErrorBanner } from '../components/AuthErrorBanner';
import { SocialAuthButtons } from '../components/SocialAuthButtons';
import { useDemoLoginMutation, useLoginMutation } from '../hooks/useAuthMutations';
import { loginSchema, type LoginFormValues } from '../validation/schemas';
import { useAuthStore } from '../store/auth-store';
import { cn } from '@/utils/cn';

interface LoginScreenProps {
  onSuccess: () => void;
  onRegister: () => void;
  onForgotPassword: () => void;
}

export function AuthLoginScreen({ onSuccess, onRegister, onForgotPassword }: LoginScreenProps) {
  const clearError = useAuthStore((s) => s.clearError);
  const storeError = useAuthStore((s) => s.error);
  const loginMutation = useLoginMutation();
  const demoLoginMutation = useDemoLoginMutation();

  const { control, handleSubmit, setValue, watch } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const rememberMe = watch('rememberMe');
  const authPending = loginMutation.isPending || demoLoginMutation.isPending;

  const onDemo = async () => {
    clearError();
    try {
      await demoLoginMutation.mutateAsync();
      onSuccess();
    } catch {
      // store
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    clearError();
    try {
      await loginMutation.mutateAsync(values);
      onSuccess();
    } catch {
      // store
    }
  });

  return (
    <AuthShell>
      <Animated.View entering={FadeInDown.duration(380).springify().damping(18)}>
        <AuthHeader
          title="Welcome back"
          subtitle="Sign in to continue organizing your work and focus."
        />

        <View className="gap-5">
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
                textContentType="emailAddress"
                leftIcon="mail-outline"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
                returnKeyType="next"
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
                placeholder="Enter your password"
                secureTextEntry
                autoComplete="password"
                textContentType="password"
                leftIcon="lock-closed-outline"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
                returnKeyType="go"
                onSubmitEditing={onSubmit}
              />
            )}
          />
        </View>

        <View className="mb-6 mt-4 flex-row items-center justify-between">
          <Pressable
            onPress={() => setValue('rememberMe', !rememberMe)}
            className="flex-row items-center py-1"
            hitSlop={6}
          >
            <View
              className={cn(
                'mr-2.5 h-5 w-5 items-center justify-center rounded-md border-2',
                rememberMe
                  ? 'border-primary bg-primary'
                  : 'border-border dark:border-border-dark',
              )}
            >
              {rememberMe ? <Ionicons name="checkmark" size={13} color="#FFFFFF" /> : null}
            </View>
            <Text className="text-[15px] text-ink-secondary dark:text-ink-dark-secondary">
              Remember me
            </Text>
          </Pressable>
          <Pressable onPress={onForgotPassword} hitSlop={8} className="py-1">
            <Text className="text-[15px] font-semibold text-primary">Forgot password?</Text>
          </Pressable>
        </View>

        {storeError ? <AuthErrorBanner message={storeError} /> : null}

        <PrimaryButton
          size="lg"
          label="Sign in"
          loading={authPending && loginMutation.isPending}
          disabled={authPending}
          onPress={onSubmit}
        />

        <View className="mt-3.5">
          <SecondaryButton
            size="lg"
            label={demoLoginMutation.isPending ? 'Opening demo…' : 'Browse demo workspace'}
            disabled={authPending}
            onPress={onDemo}
          />
        </View>

        <View className="my-8 flex-row items-center">
          <View className="h-px flex-1 bg-border dark:bg-border-dark" />
          <Text className="mx-4 text-[13px] font-semibold uppercase tracking-[0.8px] text-ink-muted">
            Continue with
          </Text>
          <View className="h-px flex-1 bg-border dark:bg-border-dark" />
        </View>

        <SocialAuthButtons onError={(message) => useAuthStore.setState({ error: message })} />

        <Pressable onPress={onRegister} className="mt-8 items-center py-2">
          <Text className="text-[15px] text-ink-secondary dark:text-ink-dark-secondary">
            New to Taskivo?{' '}
            <Text className="font-bold text-secondary">Create account</Text>
          </Text>
        </Pressable>
      </Animated.View>
    </AuthShell>
  );
}
