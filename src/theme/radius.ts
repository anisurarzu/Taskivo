export const radius = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  card: 20,
  '2xl': 28,
  '3xl': 32,
  full: 9999,
} as const;

export type RadiusToken = keyof typeof radius;
