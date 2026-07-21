import { type ReactNode } from 'react';
import { ScrollView, View, type ScrollViewProps, type ViewProps } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '@/utils/cn';

interface ScreenProps extends ViewProps {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  tabBar?: boolean;
  edges?: ('top' | 'right' | 'bottom' | 'left')[];
  scrollProps?: ScrollViewProps;
  className?: string;
  contentClassName?: string;
}

export function Screen({
  children,
  scroll = false,
  padded = true,
  tabBar = false,
  edges = ['top', 'left', 'right'],
  scrollProps,
  className,
  contentClassName,
  ...props
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = tabBar ? Math.max(insets.bottom, 8) + 72 : 24;

  const body = (
    <View className={cn(padded && 'px-5', contentClassName)}>{children}</View>
  );

  return (
    <SafeAreaView
      edges={edges}
      className={cn('flex-1 bg-background dark:bg-background-dark', className)}
      {...props}
    >
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: bottomPad, flexGrow: 1 }}
          {...scrollProps}
        >
          {body}
        </ScrollView>
      ) : (
        <View className="flex-1" style={{ paddingBottom: tabBar ? bottomPad : 0 }}>
          {body}
        </View>
      )}
    </SafeAreaView>
  );
}
