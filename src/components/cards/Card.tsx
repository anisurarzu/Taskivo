import { View, type ViewProps } from 'react-native';
import { cn } from '@/utils/cn';

interface CardProps extends ViewProps {
  className?: string;
  padded?: boolean;
}

export function Card({ children, className, padded = true, ...props }: CardProps) {
  return (
    <View
      className={cn(
        'rounded-card border border-border/60 bg-surface dark:border-border-dark dark:bg-surface-dark',
        padded && 'p-4',
        className,
      )}
      {...props}
    >
      {children}
    </View>
  );
}
