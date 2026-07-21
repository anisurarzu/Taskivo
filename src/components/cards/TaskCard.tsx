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

const priorityClass: Record<Task['priority'], string> = {
  low: 'bg-accent/15',
  medium: 'bg-primary/15',
  high: 'bg-warning/15',
  urgent: 'bg-danger/15',
};

const priorityText: Record<Task['priority'], string> = {
  low: 'text-accent',
  medium: 'text-primary',
  high: 'text-warning',
  urgent: 'text-danger',
};

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
  onToggle?: () => void;
  compact?: boolean;
}

export function TaskCard({ task, onPress, onToggle, compact = false }: TaskCardProps) {
  const colors = useThemeColors();
  const { success, light } = useHaptics();
  const scale = useSharedValue(1);
  const checkScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.985, { damping: 18 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 18 });
      }}
      onPress={() => {
        light();
        onPress?.();
      }}
      style={animatedStyle}
      className={cn(
        'mb-2.5 w-full flex-row items-start rounded-lg border border-border bg-card dark:border-border-dark dark:bg-card-dark',
        compact ? 'p-3' : 'p-3.5',
        task.isCompleted && 'opacity-55',
      )}
    >
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.isCompleted }}
        hitSlop={10}
        onPress={(e) => {
          e.stopPropagation?.();
          checkScale.value = withTiming(0.85, { duration: 80 }, () => {
            checkScale.value = withSpring(1);
          });
          success();
          onToggle?.();
        }}
        className="mr-2.5 mt-0.5"
      >
        <Animated.View
          style={checkStyle}
          className={cn(
            'h-5 w-5 items-center justify-center rounded-full border-2',
            task.isCompleted
              ? 'border-success bg-success'
              : 'border-border dark:border-border-dark',
          )}
        >
          {task.isCompleted ? <Ionicons name="checkmark" size={11} color="#FFFFFF" /> : null}
        </Animated.View>
      </Pressable>

      <View className="min-w-0 flex-1">
        <View className="mb-1.5 flex-row flex-wrap items-center gap-1.5">
          <View className={cn('rounded-full px-2 py-0.5', priorityClass[task.priority])}>
            <Text className={cn('text-[10px] font-semibold', priorityText[task.priority])}>
              {PRIORITY_LABELS[task.priority]}
            </Text>
          </View>
          {task.dueAt ? (
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={11} color={colors.textSecondary} />
              <Text className="ml-0.5 text-[11px] text-ink-secondary dark:text-ink-dark-secondary">
                {formatTime(task.dueAt)}
              </Text>
            </View>
          ) : null}
        </View>

        <Text
          numberOfLines={2}
          className={cn(
            'mb-1 text-sm font-semibold leading-5 text-ink dark:text-ink-dark',
            task.isCompleted && 'line-through',
          )}
        >
          {task.title}
        </Text>

        <View className="self-start rounded bg-surface-elevated px-1.5 py-0.5 dark:bg-surface-elevated-dark">
          <Text className="text-[10px] font-medium text-ink-secondary dark:text-ink-dark-secondary">
            {CATEGORY_LABELS[task.category]}
          </Text>
        </View>
      </View>
    </AnimatedPressable>
  );
}
