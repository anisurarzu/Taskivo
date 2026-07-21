import { type ReactNode, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';
import { useAuthStore } from '@/features/auth';

interface Props {
  children: ReactNode;
}

function AuthHydrator({ children }: Props) {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return <>{children}</>;
}

export function AppProviders({ children }: Props) {
  return (
    <GestureHandlerRootView className="flex-1">
      <QueryProvider>
        <ThemeProvider>
          <BottomSheetModalProvider>
            <AuthHydrator>{children}</AuthHydrator>
          </BottomSheetModalProvider>
        </ThemeProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
