export { colors } from './colors';
export { spacing } from './spacing';
export { radius } from './radius';
export { typography } from './typography';

export const theme = {
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceElevated: '#F1F5F9',
    text: '#111827',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    border: '#E2E8F0',
    primary: '#4F46E5',
    secondary: '#7C3AED',
    accent: '#06B6D4',
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
  },
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    surfaceElevated: '#334155',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    border: '#334155',
    primary: '#818CF8',
    secondary: '#A78BFA',
    accent: '#22D3EE',
    success: '#4ADE80',
    warning: '#FBBF24',
    danger: '#F87171',
  },
} as const;

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';
