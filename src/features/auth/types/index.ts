export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  avatarUrl?: string;
  bio?: string;
};

export type AuthSession = {
  user: AuthUser;
  tokens: AuthTokens;
  rememberMe: boolean;
  /** Present when session came from /auth/demo (read-only workspace). */
  isDemo?: boolean;
};

export type LoginPayload = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type VerifyOtpPayload = {
  email: string;
  otp: string;
  purpose?: 'register' | 'reset';
};

export type ResetPasswordPayload = {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
};

export type AuthFlowStep =
  | 'idle'
  | 'awaiting_email_verification'
  | 'awaiting_otp'
  | 'awaiting_reset'
  | 'authenticated';

export type AuthFlowPurpose = 'register' | 'reset' | null;
