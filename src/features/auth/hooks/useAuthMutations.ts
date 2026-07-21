import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth-store';
import { authService } from '../services/auth-service';
import type { LoginFormValues, RegisterFormValues } from '../validation/schemas';

export function useLoginMutation() {
  const login = useAuthStore((s) => s.login);
  return useMutation({
    mutationFn: (values: LoginFormValues) =>
      login({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      }),
  });
}

export function useRegisterMutation() {
  const register = useAuthStore((s) => s.register);
  return useMutation({
    mutationFn: (values: RegisterFormValues) =>
      register({
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      }),
  });
}

export function useForgotPasswordMutation() {
  const requestPasswordReset = useAuthStore((s) => s.requestPasswordReset);
  return useMutation({
    mutationFn: (email: string) => requestPasswordReset(email),
  });
}

export function useVerifyOtpMutation() {
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  return useMutation({
    mutationFn: (otp: string) => verifyOtp(otp),
  });
}

export function useResetPasswordMutation() {
  const resetPassword = useAuthStore((s) => s.resetPassword);
  return useMutation({
    mutationFn: (payload: { password: string; confirmPassword: string }) =>
      resetPassword(payload),
  });
}

export function useLogoutMutation() {
  const logout = useAuthStore((s) => s.logout);
  return useMutation({
    mutationFn: () => logout(),
  });
}

export function useSocialAuthPlaceholders() {
  return {
    google: useMutation({ mutationFn: () => authService.signInWithGoogle() }),
    apple: useMutation({ mutationFn: () => authService.signInWithApple() }),
    biometric: useMutation({ mutationFn: () => authService.authenticateWithBiometrics() }),
  };
}
