import { type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '@/utils/cn';

interface AuthShellProps {
  children: ReactNode;
  dense?: boolean;
}

/** Facebook-like auth canvas — gray page, white content card */
export function AuthShell({ children, dense = false }: AuthShellProps) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const bottomPad = Math.max(insets.bottom, 16) + (dense ? 20 : 28);

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <SafeAreaView edges={['top', 'left', 'right']} className="flex-1">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: bottomPad,
              minHeight: height - insets.top - 8,
              justifyContent: 'center',
            }}
          >
            <View
              className={cn(
                'w-full rounded-xl border border-border/80 bg-card px-5 py-6 shadow-card dark:border-border-dark dark:bg-card-dark',
              )}
            >
              {children}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
