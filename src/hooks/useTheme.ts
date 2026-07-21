import { useMemo } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useThemeStore } from '@/store';
import { theme, type ResolvedTheme } from '@/theme';

export function useResolvedTheme(): ResolvedTheme {
  const systemScheme = useSystemColorScheme();
  const preference = useThemeStore((s) => s.preference);

  if (preference === 'system') {
    return systemScheme === 'dark' ? 'dark' : 'light';
  }
  return preference;
}

export function useThemeColors() {
  const resolved = useResolvedTheme();
  return useMemo(() => theme[resolved], [resolved]);
}

export function useIsDark() {
  return useResolvedTheme() === 'dark';
}
