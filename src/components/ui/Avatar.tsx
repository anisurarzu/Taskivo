import { Image, Text, View } from 'react-native';
import { cn } from '@/utils/cn';

interface AvatarProps {
  name: string;
  uri?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: { box: 'h-8 w-8', text: 'text-xs' },
  md: { box: 'h-11 w-11', text: 'text-sm' },
  lg: { box: 'h-14 w-14', text: 'text-lg' },
  xl: { box: 'h-20 w-20', text: 'text-2xl' },
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function Avatar({ name, uri, size = 'md', className }: AvatarProps) {
  const dims = sizeMap[size];

  if (uri) {
    return (
      <Image
        source={{ uri }}
        className={cn('rounded-full bg-primary/20', dims.box, className)}
        accessibilityLabel={`${name} avatar`}
      />
    );
  }

  return (
    <View
      className={cn(
        'items-center justify-center rounded-full bg-primary',
        dims.box,
        className,
      )}
      accessibilityLabel={`${name} avatar`}
    >
      <Text className={cn('font-bold text-white', dims.text)}>{getInitials(name)}</Text>
    </View>
  );
}
