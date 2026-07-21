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
    size === 'sm' ? 'h-10 px-4' : size === 'lg' ? 'h-14 px-6' : 'h-12 px-5';

  return (
    <AnimatedPressable
      accessibilityRole="button"
      disabled={disabled}
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      }}
      onPress={(e) => {
        light();
        onPress?.(e);
      }}
      style={animatedStyle}
      className={cn(
        'items-center justify-center rounded-xl border border-border bg-surface dark:border-border-dark dark:bg-surface-dark',
        sizeClass,
        fullWidth && 'w-full',
        disabled && 'opacity-50',
        className,
      )}
      {...props}
    >
      <Text className="text-base font-semibold text-ink dark:text-ink-dark">{label}</Text>
    </AnimatedPressable>
  );
}
