export const APP_NAME = 'Taskivo';
export const APP_TAGLINE = 'Organize Your Life Smarter.';

export const ROUTES = {
  splash: '/',
  onboarding: '/onboarding',
  login: '/(auth)/login',
  register: '/(auth)/register',
  forgotPassword: '/(auth)/forgot-password',
  emailVerification: '/(auth)/email-verification',
  otpVerification: '/(auth)/otp-verification',
  resetPassword: '/(auth)/reset-password',
  home: '/(tabs)',
  calendar: '/(tabs)/calendar',
  focus: '/(tabs)/focus',
  analytics: '/(tabs)/analytics',
  profile: '/(tabs)/profile',
  settings: '/settings',
  notifications: '/notifications',
  search: '/search',
  taskDetails: '/task/[id]',
  createTask: '/task/create',
} as const;

export const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
} as const;

export const CATEGORY_LABELS = {
  work: 'Work',
  personal: 'Personal',
  health: 'Health',
  learning: 'Learning',
  finance: 'Finance',
  other: 'Other',
} as const;
