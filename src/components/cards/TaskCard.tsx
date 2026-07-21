import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/utils/cn';
import { formatTime } from '@/utils/format';
import { CATEGORY_LABELS, PRIORITY_LABELS } from '@/constants';
import type { Task } from '@/types';
import { useHaptics, useThemeColors } from '@/hooks';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const priorityColors: Record<Task['priority'], string> = {
  low: 'bg-accent/15 text-accent',
  medium: 'bg-primary/15 text-primary',
  high: 'bg-warning/15 text-warning',
  urgent: 'bg-danger/15 text-danger',
};

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
  onToggle?: () => void;
  index?: number;
}

export function TaskCard({ task, onPress, onToggle, index = 0 }: TaskCardProps) {
  const colors = useThemeColors();
  const { success, light } = useHaptics();
  const scale = useSharedValue(1);
  const checkScale = useSharedValue(task.isCompleted ? 1 : 0.85);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.98, { damping: 16 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 16 });
      }}
      onPress={() => {
        light();
        onPress?.();
      }}
      style={animatedStyle}
      className={cn(
        'mb-3 flex-row items-start rounded-card border border-border/70 bg-surface p-4 dark:border-border-dark dark:bg-surface-dark',
        task.isCompleted && 'opacity-60',
      )}
    >
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.isCompleted }}
        hitSlop={10}
        onPress={() => {
          checkScale.value = withTiming(task.isCompleted ? 0.85 : 1.1, { duration: 160 }, () => {
            checkScale.value = withSpring(1);
          });
          success();
          onToggle?.();
        }}
        className="mr-3 mt-0.5"
      >
        <Animated.View
          style={checkStyle}
          className={cn(
            'h-6 w-6 items-center justify-center rounded-full border-2',
            task.isCompleted
              ? 'border-success bg-success'
              : 'border-border dark:border-border-dark',
          )}
        >
          {task.isCompleted ? <Ionicons name="checkmark" size={14} color="#FFFFFF" /> : null}
        </Animated.View>
      </Pressable>

      <View className="flex-1">
        <View className="mb-2 flex-row items-center justify-between">
          <View
            className={cn(
              'rounded-full px-2.5 py-1',
              priorityColors[task.priority].split(' ')[0],
            )}
          >
            <Text
              className={cn(
                'text-xs font-semibold',
                priorityColors[task.priority].split(' ')[1],
              )}
            >
              {PRIORITY_LABELS[task.priority]}
            </Text>
          </View>
          {task.dueAt ? (
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
              <Text className="ml-1 text-xs text-ink-secondary dark:text-ink-dark-secondary">
                {formatTime(task.dueAt)}
              </Text>
            </View>
          ) : null}
        </View>

        <Text
          className={cn(
            'mb-1 text-base font-semibold text-ink dark:text-ink-dark',
            task.isCompleted && 'line-through',
          )}
        >
          {task.title}
        </Text>

        <View className="flex-row items-center">
          <View className="rounded-md bg-surface-elevated px-2 py-1 dark:bg-surface-elevated-dark">
            <Text className="text-xs font-medium text-ink-secondary dark:text-ink-dark-secondary">
              {CATEGORY_LABELS[task.category]}
            </Text>
          </View>
          {index >= 0 ? null : null}
        </View>
      </View>
    </AnimatedPressable>
  );
}
