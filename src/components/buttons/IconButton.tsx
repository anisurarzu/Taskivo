import { Pressable, type PressableProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { cn } from '@/utils/cn';
import { useThemeColors } from '@/hooks';
import { useHaptics } from '@/hooks';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface IconButtonProps extends PressableProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  variant?: 'ghost' | 'filled' | 'soft';
  className?: string;
  iconColor?: string;
}

export function IconButton({
  name,
  size = 20,
  variant = 'ghost',
  className,
  iconColor,
  disabled,
  onPress,
  ...props
}: IconButtonProps) {
  const colors = useThemeColors();
  const scale = useSharedValue(1);
  const { light } = useHaptics();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const variantClass =
    variant === 'filled'
      ? 'bg-primary'
      : variant === 'soft'
        ? 'bg-surface-elevated dark:bg-surface-elevated-dark'
        : 'bg-transparent';

  const resolvedIconColor =
    iconColor ?? (variant === 'filled' ? '#FFFFFF' : colors.text);

  return (
    <AnimatedPressable
      accessibilityRole="button"
      disabled={disabled}
      hitSlop={8}
      onPressIn={() => {
        scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
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
        'h-10 w-10 items-center justify-center rounded-full',
        variantClass,
        disabled && 'opacity-40',
        className,
      )}
      {...props}
    >
      <Ionicons name={name} size={size} color={resolvedIconColor} />
    </AnimatedPressable>
  );
}
