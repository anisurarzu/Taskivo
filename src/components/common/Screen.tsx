import { type ReactNode } from 'react';
import { ScrollView, View, type ScrollViewProps, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '@/utils/cn';

interface ScreenProps extends ViewProps {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: ('top' | 'right' | 'bottom' | 'left')[];
  scrollProps?: ScrollViewProps;
  className?: string;
  contentClassName?: string;
}

export function Screen({
  children,
  scroll = false,
  padded = true,
  edges = ['top', 'left', 'right'],
  scrollProps,
  className,
  contentClassName,
  ...props
}: ScreenProps) {
  const content = (
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
          contentContainerClassName="pb-8 grow"
          {...scrollProps}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}
