import { create } from 'zustand';
import { authService } from '../services/auth-service';
import { authStorage } from '../services/auth-storage';
import type {
  AuthFlowPurpose,
  AuthFlowStep,
  AuthSession,
  AuthUser,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from '../types';

interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  isHydrated: boolean;
  isLoading: boolean;
  error: string | null;
  flowEmail: string | null;
  flowOtp: string | null;
  flowPurpose: AuthFlowPurpose;
  flowStep: AuthFlowStep;
  hydrate: () => Promise<void>;
  completeOnboarding: () => void;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<'reset' | 'authenticated'>;
  resetPassword: (payload: Omit<ResetPasswordPayload, 'email' | 'otp'>) => Promise<void>;
  markEmailVerified: () => void;
  logout: () => Promise<void>;
  clearError: () => void;
  setFlowEmail: (email: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  isHydrated: false,
  isLoading: false,
  error: null,
  flowEmail: null,
  flowOtp: null,
  flowPurpose: null,
  flowStep: 'idle',

  hydrate: async () => {
    const onboarding = authStorage.getOnboardingCompleted();
    const session = await authStorage.getSession();
    set({
      hasCompletedOnboarding: onboarding,
      session,
      user: session?.user ?? null,
      isAuthenticated: Boolean(session?.tokens.accessToken),
      isHydrated: true,
    });
  },

  completeOnboarding: () => {
    authStorage.setOnboardingCompleted();
    set({ hasCompletedOnboarding: true });
  },

  login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const session = await authService.login(payload);
      await authStorage.saveSession(session);
      set({
        session,
        user: session.user,
        isAuthenticated: true,
        isLoading: false,
        flowStep: 'authenticated',
        flowPurpose: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unable to sign in',
      });
      throw error;
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authService.register(payload);
      await authService.sendVerificationEmail(payload.email);
      set({
        isLoading: false,
        flowEmail: payload.email,
        flowPurpose: 'register',
        flowStep: 'awaiting_email_verification',
        user: result.user,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unable to create account',
      });
      throw error;
    }
  },

  requestPasswordReset: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await authService.forgotPassword({ email });
      set({
        isLoading: false,
        flowEmail: email,
        flowPurpose: 'reset',
        flowStep: 'awaiting_otp',
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unable to send reset email',
      });
      throw error;
    }
  },

  verifyOtp: async (otp) => {
    const email = get().flowEmail;
    const purpose = get().flowPurpose;
    if (!email) throw new Error('Missing email for verification');
    set({ isLoading: true, error: null });
    try {
      await authService.verifyOtp({ email, otp });

      if (purpose === 'register') {
        const session = await authService.login({
          email,
          password: 'Verified1',
          rememberMe: true,
        });
        const verifiedUser = {
          ...session.user,
          name: get().user?.name ?? session.user.name,
          emailVerified: true,
        };
        const nextSession: AuthSession = { ...session, user: verifiedUser };
        await authStorage.saveSession(nextSession);
        set({
          session: nextSession,
          user: verifiedUser,
          isAuthenticated: true,
          isLoading: false,
          flowOtp: null,
          flowPurpose: null,
          flowStep: 'authenticated',
        });
        return 'authenticated';
      }

      set({
        isLoading: false,
        flowOtp: otp,
        flowStep: 'awaiting_reset',
      });
      return 'reset';
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Invalid code',
      });
      throw error;
    }
  },

  resetPassword: async ({ password, confirmPassword }) => {
    const email = get().flowEmail;
    const otp = get().flowOtp;
    if (!email || !otp) throw new Error('Missing email or OTP for reset');
    set({ isLoading: true, error: null });
    try {
      const session = await authService.resetPassword({
        email,
        otp,
        password,
        confirmPassword,
      });
      await authStorage.saveSession(session);
      set({
        session,
        user: session.user,
        isAuthenticated: true,
        isLoading: false,
        flowStep: 'authenticated',
        flowOtp: null,
        flowPurpose: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unable to reset password',
      });
      throw error;
    }
  },

  markEmailVerified: () => {
    const user = get().user;
    if (!user) {
      set({ flowStep: 'awaiting_otp' });
      return;
    }
    set({
      user: { ...user, emailVerified: true },
      flowStep: 'awaiting_otp',
    });
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.logout();
      await authStorage.clearSession();
      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        flowStep: 'idle',
        flowEmail: null,
        flowOtp: null,
        flowPurpose: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unable to sign out',
      });
    }
  },

  clearError: () => set({ error: null }),
  setFlowEmail: (email) => set({ flowEmail: email }),
}));
