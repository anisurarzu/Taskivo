import { View, type ViewProps } from 'react-native';
import { cn } from '@/utils/cn';

interface CardProps extends ViewProps {
  className?: string;
  padded?: boolean;
  elevated?: boolean;
}

export function Card({
  children,
  className,
  padded = true,
  elevated = false,
  ...props
}: CardProps) {
  return (
    <View
      className={cn(
        'overflow-hidden rounded-lg border border-border bg-card dark:border-border-dark dark:bg-card-dark',
        elevated && 'shadow-soft',
        padded && 'p-3.5',
        className,
      )}
      {...props}
    >
      {children}
    </View>
  );
}
