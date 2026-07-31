import { Pressable, Text, ActivityIndicator, type PressableProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { cn } from '@/utils/cn';
import { useHaptics } from '@/hooks';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PrimaryButtonProps extends PressableProps {
  label: string;
  loading?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PrimaryButton({
  label,
  loading = false,
  fullWidth = true,
  size = 'md',
  disabled,
  className,
  onPress,
  ...props
}: PrimaryButtonProps) {
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
      disabled={disabled || loading}
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
        'items-center justify-center bg-primary active:bg-primary-dark',
        radiusClass,
        sizeClass,
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50',
        className,
      )}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text className={cn('font-semibold tracking-tight text-white', textClass)}>{label}</Text>
      )}
    </AnimatedPressable>
  );
}
