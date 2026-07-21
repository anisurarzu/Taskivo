import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/common';
import { Card } from '@/components/cards';
import { IconButton, PrimaryButton, SecondaryButton } from '@/components/buttons';
import { CATEGORY_LABELS, PRIORITY_LABELS } from '@/constants';
import { formatDate, formatTime } from '@/utils/format';
import { mockTasks } from '@/data/mock';
import { useThemeColors } from '@/hooks';

interface TaskDetailsScreenProps {
  taskId: string;
  onBack: () => void;
  onEdit: () => void;
}

export function TaskDetailsScreen({ taskId, onBack, onEdit }: TaskDetailsScreenProps) {
  const colors = useThemeColors();
  const task = mockTasks.find((t) => t.id === taskId) ?? mockTasks[0];

  return (
    <Screen scroll>
      <Animated.View entering={FadeInDown.duration(400)} className="pt-2">
        <View className="mb-6 flex-row items-center justify-between">
          <IconButton name="chevron-back" onPress={onBack} className="-ml-2" />
          <View className="flex-row">
            <IconButton name="create-outline" onPress={onEdit} />
            <IconButton name="ellipsis-horizontal" />
          </View>
        </View>

        <View className="mb-3 flex-row gap-2">
          <View className="rounded-full bg-primary/15 px-3 py-1">
            <Text className="text-xs font-semibold text-primary">
              {PRIORITY_LABELS[task.priority]}
            </Text>
          </View>
          <View className="rounded-full bg-surface-elevated px-3 py-1 dark:bg-surface-elevated-dark">
            <Text className="text-xs font-semibold text-ink-secondary dark:text-ink-dark-secondary">
              {CATEGORY_LABELS[task.category]}
            </Text>
          </View>
        </View>

        <Text className="mb-3 text-3xl font-bold text-ink dark:text-ink-dark">{task.title}</Text>
        <Text className="mb-8 text-base leading-7 text-ink-secondary dark:text-ink-dark-secondary">
          {task.description ?? 'No description added yet.'}
        </Text>

        <Card className="mb-6">
          {[
            {
              icon: 'time-outline' as const,
              label: 'Due',
              value: task.dueAt
                ? `${formatDate(task.dueAt, { weekday: 'short', month: 'short', day: 'numeric' })} · ${formatTime(task.dueAt)}`
                : 'No due date',
            },
            {
              icon: 'flag-outline' as const,
              label: 'Status',
              value: task.isCompleted ? 'Completed' : 'Active',
            },
            {
              icon: 'calendar-outline' as const,
              label: 'Created',
              value: formatDate(task.createdAt, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }),
            },
          ].map((row, index, arr) => (
            <View
              key={row.label}
              className={`flex-row items-center py-3 ${
                index < arr.length - 1 ? 'border-b border-border/60 dark:border-border-dark' : ''
              }`}
            >
              <Ionicons name={row.icon} size={18} color={colors.textSecondary} />
              <Text className="ml-3 flex-1 text-sm text-ink-secondary dark:text-ink-dark-secondary">
                {row.label}
              </Text>
              <Text className="text-sm font-semibold text-ink dark:text-ink-dark">{row.value}</Text>
            </View>
          ))}
        </Card>

        <View className="gap-3">
          <PrimaryButton label="Mark complete" onPress={() => undefined} />
          <SecondaryButton label="Edit task" onPress={onEdit} />
        </View>
      </Animated.View>
    </Screen>
  );
}
