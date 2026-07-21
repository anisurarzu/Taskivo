import type {
  AuthSession,
  AuthUser,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  VerifyOtpPayload,
} from '../types';

const MOCK_OTP = '123456';
const delay = (ms = 700) => new Promise((resolve) => setTimeout(resolve, ms));

function createTokens(email: string) {
  const now = Date.now();
  return {
    accessToken: `mock.access.${email}.${now}`,
    refreshToken: `mock.refresh.${email}.${now}`,
    expiresAt: now + 60 * 60 * 1000,
  };
}

function createUser(name: string, email: string, verified = true): AuthUser {
  return {
    id: `user_${email}`,
    name,
    email,
    emailVerified: verified,
  };
}

/**
 * Mock auth service — swap for real API later without changing screens.
 */
export const authService = {
  async login(payload: LoginPayload): Promise<AuthSession> {
    await delay();
    if (!payload.email || !payload.password) {
      throw new Error('Invalid credentials');
    }
    if (payload.password.length < 8) {
      throw new Error('Invalid email or password');
    }
    return {
      user: createUser(payload.email.split('@')[0] ?? 'User', payload.email, true),
      tokens: createTokens(payload.email),
      rememberMe: Boolean(payload.rememberMe),
    };
  },

  async register(payload: RegisterPayload): Promise<{ user: AuthUser; requiresVerification: boolean }> {
    await delay();
    return {
      user: createUser(payload.name, payload.email, false),
      requiresVerification: true,
    };
  },

  async sendVerificationEmail(email: string) {
    await delay(500);
    return { success: true as const, email, message: 'Verification email sent' };
  },

  async forgotPassword(payload: ForgotPasswordPayload) {
    await delay();
    return { success: true as const, email: payload.email, otpHint: MOCK_OTP };
  },

  async verifyOtp(payload: VerifyOtpPayload) {
    await delay();
    if (payload.otp !== MOCK_OTP) {
      throw new Error('Invalid verification code');
    }
    return { success: true as const, email: payload.email };
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<AuthSession> {
    await delay();
    if (payload.otp !== MOCK_OTP) {
      throw new Error('Invalid or expired code');
    }
    return {
      user: createUser(payload.email.split('@')[0] ?? 'User', payload.email, true),
      tokens: createTokens(payload.email),
      rememberMe: true,
    };
  },

  async logout() {
    await delay(300);
    return { success: true as const };
  },

  /** Architecture placeholders — wire native SDKs later */
  async signInWithGoogle() {
    await delay();
    throw new Error('Google Sign-In will be available soon');
  },

  async signInWithApple() {
    await delay();
    throw new Error('Apple Sign-In will be available soon');
  },

  async authenticateWithBiometrics() {
    await delay();
    throw new Error('Biometric authentication will be available soon');
  },
};

export const MOCK_AUTH_OTP = MOCK_OTP;
