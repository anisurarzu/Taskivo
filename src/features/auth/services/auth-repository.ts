import { getApiErrorMessage, isMockApi, wakeApi, withRetries } from '@/services/api';
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

/**
 * Auth data access — shared Taskivo-Web backend when mock is off.
 */
export const authRepository = {
  async login(payload: LoginPayload): Promise<AuthSession> {
    if (isMockApi()) return authService.login(payload);
    await wakeApi();
    try {
      const { data } = await withRetries(() => authApi.login(payload));
      return data as AuthSession;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Unable to sign in'));
    }
  },

  async demoBrowse(): Promise<AuthSession> {
    if (isMockApi()) {
      return authService.login({
        email: 'demo@taskivo.app',
        password: 'Taskivo123',
        rememberMe: true,
      });
    }
    await wakeApi();
    try {
      const { data } = await withRetries(() => authApi.demoBrowse());
      return data as AuthSession;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Unable to open demo'));
    }
  },

  async register(
    payload: RegisterPayload,
  ): Promise<{ user?: AuthUser; requiresVerification: boolean; email?: string; otpHint?: string }> {
    if (isMockApi()) return authService.register(payload);
    await wakeApi();
    try {
      const { data } = await withRetries(() => authApi.register(payload));
      return data as {
        user?: AuthUser;
        requiresVerification: boolean;
        email?: string;
        otpHint?: string;
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Unable to create account'));
    }
  },

  async sendVerificationEmail(email: string) {
    if (isMockApi()) return authService.sendVerificationEmail(email);
    try {
      const { data } = await authApi.resendOtp(email, 'register');
      return data as { success: boolean; email: string; otpHint?: string };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Unable to resend code'));
    }
  },

  async forgotPassword(payload: ForgotPasswordPayload) {
    if (isMockApi()) return authService.forgotPassword(payload);
    await wakeApi();
    try {
      const { data } = await withRetries(() => authApi.forgotPassword(payload.email));
      return data as { success: true; email: string; otpHint?: string };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Unable to send reset email'));
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
      const { data } = await withRetries(() =>
        authApi.verifyOtp(payload.email, payload.otp, payload.purpose),
      );
      return data as { success: true; email: string; session?: AuthSession };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Invalid code'));
    }
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<AuthSession> {
    if (isMockApi()) return authService.resetPassword(payload);
    try {
      const { data } = await withRetries(() =>
        authApi.resetPassword({
          email: payload.email,
          otp: payload.otp,
          password: payload.password,
        }),
      );
      return data as AuthSession;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Unable to reset password'));
    }
  },

  async refresh(refreshToken: string): Promise<AuthSession> {
    if (isMockApi()) {
      throw new Error('Refresh not available in mock mode');
    }
    try {
      const { data } = await authApi.refresh(refreshToken);
      return data as AuthSession;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Session expired'));
    }
  },

  async me(): Promise<AuthUser> {
    if (isMockApi()) {
      throw new Error('Not available in mock mode');
    }
    try {
      const { data } = await authApi.me();
      return data as AuthUser;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Unable to load profile'));
    }
  },

  async updateProfile(body: { name?: string; bio?: string; avatarUrl?: string }): Promise<AuthUser> {
    if (isMockApi()) {
      throw new Error('Profile update not available in mock mode');
    }
    try {
      const { data } = await authApi.updateProfile(body);
      return data as AuthUser;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Unable to update profile'));
    }
  },

  async changePassword(body: { currentPassword: string; newPassword: string }) {
    if (isMockApi()) {
      throw new Error('Change password not available in mock mode');
    }
    try {
      const { data } = await authApi.changePassword(body);
      return data as { success: boolean };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Unable to change password'));
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
