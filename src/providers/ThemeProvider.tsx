import { useEffect, type ReactNode } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useThemeStore } from '@/store';
import type { ResolvedTheme } from '@/theme';

interface Props {
  children: ReactNode;
}

export function ThemeProvider({ children }: Props) {
  const systemScheme = useSystemColorScheme();
  const { preference, hydrate } = useThemeStore();
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const resolved: ResolvedTheme =
      preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;
    setColorScheme(resolved);
  }, [preference, systemScheme, setColorScheme]);

  return <>{children}</>;
}
