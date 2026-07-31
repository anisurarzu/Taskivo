import { Pressable, Text, type PressableProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { cn } from '@/utils/cn';
import { useHaptics } from '@/hooks';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SecondaryButtonProps extends PressableProps {
  label: string;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SecondaryButton({
  label,
  fullWidth = true,
  size = 'md',
  disabled,
  className,
  onPress,
  ...props
}: SecondaryButtonProps) {
  const scale = useSharedValue(1);
  const { light } = useHaptics();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const sizeClass =
    size === 'sm' ? 'h-11 px-4' : size === 'lg' ? 'h-14 px-6' : 'h-12 px-5';
  const textClass = size === 'sm' ? 'text-[15px]' : size === 'lg' ? 'text-[17px]' : 'text-[16px]';
  const radiusClass = 'rounded-xl';

  return (
    <AnimatedPressable
      accessibilityRole="button"
      disabled={disabled}
      onPressIn={() => {
        scale.value = withSpring(0.98, { damping: 16, stiffness: 320 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 16, stiffness: 320 });
      }}
      onPress={(e) => {
        light();
        onPress?.(e);
      }}
      style={animatedStyle}
      className={cn(
        'items-center justify-center border border-border bg-card dark:border-border-dark dark:bg-card-dark',
        radiusClass,
        sizeClass,
        fullWidth && 'w-full',
        disabled && 'opacity-50',
        className,
      )}
      {...props}
    >
      <Text className={cn('font-semibold tracking-tight text-ink dark:text-ink-dark', textClass)}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}
