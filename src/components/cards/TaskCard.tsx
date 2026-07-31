import { Pressable, Text, View } from 'react-native';
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/utils/cn';
import { formatTime } from '@/utils/format';
import { PRIORITY_LABELS, getCategoryLabel } from '@/constants';
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

const STATUS_LABEL: Record<string, string> = {
  todo: 'To do',
  in_progress: 'In progress',
  completed: 'Done',
  cancelled: 'Cancelled',
};

function taskProgress(task: Task): number {
  if (task.isCompleted || task.status === 'completed') return 100;
  const tracked = task.tracking?.progressPct;
  if (typeof tracked === 'number' && Number.isFinite(tracked)) {
    return Math.max(0, Math.min(100, Math.round(tracked)));
  }
  if (task.subtasks?.length) {
    const done = task.subtasks.filter((s) => s.isCompleted).length;
    return Math.round((done / task.subtasks.length) * 100);
  }
  if (task.status === 'in_progress') return 35;
  return 0;
}

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
  onToggle?: () => void;
  compact?: boolean;
  /** Show description, progress, budget — use on team/org lists */
  detailed?: boolean;
  budgetLabel?: string;
}

export function TaskCard({
  task,
  onPress,
  onToggle,
  compact = false,
  detailed = false,
  budgetLabel,
}: TaskCardProps) {
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

  const isOverdue =
    Boolean(task.dueAt) && !task.isCompleted && new Date(task.dueAt!).getTime() < Date.now();
  const progress = taskProgress(task);
  const hasBudget =
    Boolean(task.budgetId) ||
    (typeof task.budgetAllocated === 'number' && task.budgetAllocated > 0);
  const description = task.description?.trim();
  const statusLabel = STATUS_LABEL[task.status] ?? task.status;

  return (
    <AnimatedPressable
      entering={FadeInUp.duration(240)}
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
        'mb-3 w-full flex-row items-start rounded-xl border border-border/70 bg-card dark:border-border-dark dark:bg-card-dark',
        compact ? 'p-3.5' : 'px-4 py-4',
        task.isCompleted && 'opacity-60',
      )}
    >
      {onToggle ? (
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
            onToggle();
          }}
          className="mr-3.5 mt-0.5"
        >
          <Animated.View
            style={checkStyle}
            className={cn(
              'h-7 w-7 items-center justify-center rounded-full border-2',
              task.isCompleted
                ? 'border-success bg-success'
                : 'border-border dark:border-border-dark',
            )}
          >
            {task.isCompleted ? <Ionicons name="checkmark" size={14} color="#FFFFFF" /> : null}
          </Animated.View>
        </Pressable>
      ) : null}

      <View className="min-w-0 flex-1">
        <Text
          numberOfLines={2}
          className={cn(
            'text-[17px] font-semibold leading-6 text-ink dark:text-ink-dark',
            task.isCompleted && 'line-through',
            !detailed && 'mb-2.5',
          )}
        >
          {task.title}
        </Text>

        {detailed && description ? (
          <Text
            numberOfLines={2}
            className="mt-1.5 text-[14px] leading-5 text-ink-secondary dark:text-ink-dark-secondary"
          >
            {description}
          </Text>
        ) : null}

        <View className={cn('flex-row flex-wrap items-center gap-2', detailed ? 'mt-3' : '')}>
          {detailed ? (
            <View className="rounded-full bg-surface-elevated px-2.5 py-1 dark:bg-surface-elevated-dark">
              <Text className="text-[12px] font-semibold text-ink-secondary dark:text-ink-dark-secondary">
                {statusLabel}
              </Text>
            </View>
          ) : null}
          <View className={cn('rounded-full px-2.5 py-1', priorityClass[task.priority])}>
            <Text className={cn('text-[12px] font-semibold', priorityText[task.priority])}>
              {PRIORITY_LABELS[task.priority]}
            </Text>
          </View>
          <View className="rounded-full bg-surface-elevated px-2.5 py-1 dark:bg-surface-elevated-dark">
            <Text className="text-[12px] font-medium text-ink-secondary dark:text-ink-dark-secondary">
              {getCategoryLabel(task.category)}
            </Text>
          </View>
          {task.dueAt ? (
            <View className="flex-row items-center">
              <Ionicons
                name="time-outline"
                size={14}
                color={isOverdue ? colors.danger : colors.textSecondary}
              />
              <Text
                className={cn(
                  'ml-1 text-[12px] font-medium',
                  isOverdue
                    ? 'text-danger'
                    : 'text-ink-secondary dark:text-ink-dark-secondary',
                )}
              >
                {formatTime(task.dueAt)}
              </Text>
            </View>
          ) : null}
        </View>

        {detailed ? (
          <View className="mt-3.5">
            <View className="mb-1.5 flex-row items-center justify-between">
              <Text className="text-[13px] font-medium text-ink-secondary dark:text-ink-dark-secondary">
                Progress
              </Text>
              <Text className="text-[13px] font-bold text-ink dark:text-ink-dark">{progress}%</Text>
            </View>
            <View className="h-2.5 overflow-hidden rounded-full bg-surface-elevated dark:bg-surface-elevated-dark">
              <View
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.max(progress, progress > 0 ? 3 : 0)}%` }}
              />
            </View>
          </View>
        ) : null}

        {detailed && hasBudget ? (
          <View className="mt-3 flex-row items-center rounded-lg bg-primary/10 px-3 py-2.5">
            <Ionicons name="wallet-outline" size={16} color={colors.primary} />
            <Text className="ml-2 flex-1 text-[13px] font-semibold text-primary" numberOfLines={1}>
              {budgetLabel ?? 'Budget'}
              {typeof task.budgetAllocated === 'number'
                ? ` · ${task.budgetAllocated.toLocaleString()}`
                : ''}
            </Text>
          </View>
        ) : null}

        {detailed && !description && !hasBudget ? (
          <Text className="mt-3 text-[13px] text-ink-muted">Tap for full details</Text>
        ) : null}
      </View>

      {detailed ? (
        <Ionicons
          name="chevron-forward"
          size={18}
          color={colors.textMuted}
          style={{ marginTop: 4, marginLeft: 4 }}
        />
      ) : null}
    </AnimatedPressable>
  );
}
