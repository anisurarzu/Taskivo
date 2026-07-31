export const radius = {
  none: 0,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  card: 12,
  '2xl': 16,
  '3xl': 20,
  full: 9999,
} as const;

export type RadiusToken = keyof typeof radius;
