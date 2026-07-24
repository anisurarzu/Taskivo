import { type ReactNode, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';
import { useAuthStore } from '@/features/auth';
import { usePreferencesStore } from '@/store/preferences-store';
import { useFocusUiStore } from '@/features/focus';
import { apiClient, isMockApi } from '@/services/api';

interface Props {
  children: ReactNode;
}

function AppHydrator({ children }: Props) {
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const hydratePrefs = usePreferencesStore((s) => s.hydrate);
  const setDurationMinutes = useFocusUiStore((s) => s.setDurationMinutes);
  const defaultFocusMinutes = usePreferencesStore((s) => s.defaultFocusMinutes);
  const prefsHydrated = usePreferencesStore((s) => s.hydrated);

  useEffect(() => {
    void hydrateAuth();
    hydratePrefs();
    // Wake Render free tier before first login/register.
    if (!isMockApi()) {
      void apiClient.get('/health').catch(() => undefined);
    }
  }, [hydrateAuth, hydratePrefs]);

  useEffect(() => {
    if (!prefsHydrated) return;
    setDurationMinutes(defaultFocusMinutes);
  }, [prefsHydrated, defaultFocusMinutes, setDurationMinutes]);

  return <>{children}</>;
}

export function AppProviders({ children }: Props) {
  return (
    <GestureHandlerRootView className="flex-1">
      <QueryProvider>
        <ThemeProvider>
          <BottomSheetModalProvider>
            <AppHydrator>{children}</AppHydrator>
          </BottomSheetModalProvider>
        </ThemeProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
