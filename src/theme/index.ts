export { colors } from './colors';
export { spacing } from './spacing';
export { radius } from './radius';
export { typography } from './typography';

/** Meta / Facebook chrome with Taskivo green */
export const theme = {
  light: {
    background: '#F0F2F5',
    surface: '#FFFFFF',
    surfaceElevated: '#E4E6EB',
    card: '#FFFFFF',
    text: '#1C1E21',
    textSecondary: '#65676B',
    textMuted: '#8A8D91',
    border: '#CED0D4',
    primary: '#0F9F6E',
    primaryLight: '#14B887',
    primaryDark: '#0B7A55',
    secondary: '#42B72A',
    accent: '#0866FF',
    success: '#31A24C',
    warning: '#F7B928',
    danger: '#FA383E',
  },
  dark: {
    background: '#18191A',
    surface: '#242526',
    surfaceElevated: '#3A3B3C',
    card: '#242526',
    text: '#E4E6EB',
    textSecondary: '#B0B3B8',
    textMuted: '#8A8D91',
    border: '#3E4042',
    primary: '#14B887',
    primaryLight: '#34D399',
    primaryDark: '#0F9F6E',
    secondary: '#42B72A',
    accent: '#4599FF',
    success: '#31A24C',
    warning: '#F7B928',
    danger: '#FA383E',
  },
} as const;

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';
