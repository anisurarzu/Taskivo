import axios from 'axios';
import { isMockApi } from '@/services/api/config';
import { authApi } from '../api/auth-api';
import { authService } from './auth-service';
import type {
  AuthSession,
  AuthUser,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  VerifyOtpPayload,
} from '../types';

function apiErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return 'Server is waking up. Wait a few seconds and try again.';
    }
    if (!error.response) {
      return 'Cannot reach API. Check internet or try again in a moment.';
    }
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    if (message) return message;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

/**
 * Auth data access — mock local service by default, real JWT API when mock is off.
 */
export const authRepository = {
  async login(payload: LoginPayload): Promise<AuthSession> {
    if (isMockApi()) return authService.login(payload);
    try {
      const { data } = await authApi.login(payload);
      return data as AuthSession;
    } catch (error) {
      throw new Error(apiErrorMessage(error, 'Unable to sign in'));
    }
  },

  async register(
    payload: RegisterPayload,
  ): Promise<{ user: AuthUser; requiresVerification: boolean }> {
    if (isMockApi()) return authService.register(payload);
    try {
      const { data } = await authApi.register(payload);
      return data as { user: AuthUser; requiresVerification: boolean };
    } catch (error) {
      throw new Error(apiErrorMessage(error, 'Unable to create account'));
    }
  },

  async sendVerificationEmail(email: string) {
    if (isMockApi()) return authService.sendVerificationEmail(email);
    // Registration already creates OTP server-side.
    return { success: true as const, email, message: 'Verification email sent' };
  },

  async forgotPassword(payload: ForgotPasswordPayload) {
    if (isMockApi()) return authService.forgotPassword(payload);
    try {
      const { data } = await authApi.forgotPassword(payload.email);
      return data as { success: true; email: string };
    } catch (error) {
      throw new Error(apiErrorMessage(error, 'Unable to send reset email'));
    }
  },

  async verifyOtp(
    payload: VerifyOtpPayload & { purpose?: 'register' | 'reset' },
  ): Promise<{ success: true; email: string; session?: AuthSession }> {
    if (isMockApi()) {
      await authService.verifyOtp(payload);
      return { success: true, email: payload.email };
    }
    try {
      const { data } = await authApi.verifyOtp(payload.email, payload.otp, payload.purpose);
      return data as { success: true; email: string; session?: AuthSession };
    } catch (error) {
      throw new Error(apiErrorMessage(error, 'Invalid code'));
    }
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<AuthSession> {
    if (isMockApi()) return authService.resetPassword(payload);
    try {
      const { data } = await authApi.resetPassword({
        email: payload.email,
        otp: payload.otp,
        password: payload.password,
      });
      return data as AuthSession;
    } catch (error) {
      throw new Error(apiErrorMessage(error, 'Unable to reset password'));
    }
  },

  async logout() {
    if (isMockApi()) return authService.logout();
    try {
      await authApi.logout();
      return { success: true as const };
    } catch {
      return { success: true as const };
    }
  },
};
