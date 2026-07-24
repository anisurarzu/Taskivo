import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/common';
import { Card } from '@/components/cards';
import { IconButton, PrimaryButton, SecondaryButton } from '@/components/buttons';
import { AppModal } from '@/components/modals';
import { Loading, EmptyState } from '@/components/ui';
import { CATEGORY_LABELS, PRIORITY_LABELS } from '@/constants';
import { formatDate, formatTime } from '@/utils/format';
import { useThemeColors } from '@/hooks';
import { cn } from '@/utils/cn';
import {
  useDeleteTaskMutation,
  useTaskQuery,
  useToggleTaskMutation,
  useUpdateTaskMutation,
} from '../hooks/useTaskQueries';

interface TaskDetailsScreenProps {
  taskId: string;
  onBack: () => void;
  onEdit: () => void;
  onDeleted: () => void;
}

export function TaskDetailsScreen({
  taskId,
  onBack,
  onEdit,
  onDeleted,
}: TaskDetailsScreenProps) {
  const colors = useThemeColors();
  const { data: task, isLoading, isError, refetch } = useTaskQuery(taskId);
  const toggleTask = useToggleTaskMutation();
  const updateTask = useUpdateTaskMutation();
  const deleteTask = useDeleteTaskMutation();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Screen>
        <Loading fullScreen label="Loading task..." />
      </Screen>
    );
  }

  if (isError || !task) {
    return (
      <Screen>
        <EmptyState
          title="Task not found"
          description="This task may have been deleted."
          actionLabel="Go back"
          onAction={onBack}
          icon="alert-circle-outline"
        />
        <PrimaryButton label="Retry" onPress={() => void refetch()} className="mx-5" />
      </Screen>
    );
  }

  const completedSubtasks = task.subtasks.filter((item) => item.isCompleted).length;

  const onToggleSubtask = async (subtaskId: string) => {
    setActionError(null);
    try {
      await updateTask.mutateAsync({
        id: task.id,
        input: {
          subtasks: task.subtasks.map((item) =>
            item.id === subtaskId ? { ...item, isCompleted: !item.isCompleted } : item,
          ),
        },
      });
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not update subtask.');
    }
  };

  const onDelete = async () => {
    setActionError(null);
    try {
      await deleteTask.mutateAsync(task.id);
      setConfirmDelete(false);
      onDeleted();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not delete task.');
    }
  };

  return (
    <Screen scroll>
      <Animated.View entering={FadeInDown.duration(400)} className="pt-2">
        <View className="mb-6 flex-row items-center justify-between">
          <IconButton name="chevron-back" onPress={onBack} className="-ml-2" />
          <View className="flex-row">
            <IconButton name="create-outline" onPress={onEdit} />
            <IconButton name="trash-outline" onPress={() => setConfirmDelete(true)} />
          </View>
        </View>

        <View className="mb-3 flex-row flex-wrap gap-2">
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
          {task.isCompleted ? (
            <View className="rounded-full bg-success/15 px-3 py-1">
              <Text className="text-xs font-semibold text-success">Completed</Text>
            </View>
          ) : null}
        </View>

        <Text className="mb-3 text-3xl font-bold text-ink dark:text-ink-dark">{task.title}</Text>

        <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted dark:text-ink-dark-secondary">
          Notes
        </Text>
        <Text className="mb-8 text-base leading-7 text-ink-secondary dark:text-ink-dark-secondary">
          {task.description?.trim() ? task.description : 'No notes added yet.'}
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
            {
              icon: 'refresh-outline' as const,
              label: 'Updated',
              value: formatDate(task.updatedAt, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }),
            },
          ].map((row, index, arr) => (
            <View
              key={row.label}
              className={`flex-row items-center py-3 ${
                index < arr.length - 1 ? 'border-b border-border dark:border-border-dark' : ''
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

        {task.subtasks.length > 0 ? (
          <View className="mb-6">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-ink dark:text-ink-dark">Subtasks</Text>
              <Text className="text-xs text-ink-secondary dark:text-ink-dark-secondary">
                {completedSubtasks}/{task.subtasks.length}
              </Text>
            </View>
            <View className="gap-2">
              {task.subtasks.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => void onToggleSubtask(item.id)}
                  disabled={updateTask.isPending}
                  className="flex-row items-center rounded-xl border border-border bg-card px-3 py-3 dark:border-border-dark dark:bg-card-dark"
                >
                  <View
                    className={cn(
                      'mr-3 h-5 w-5 items-center justify-center rounded-full border-2',
                      item.isCompleted
                        ? 'border-success bg-success'
                        : 'border-border dark:border-border-dark',
                    )}
                  >
                    {item.isCompleted ? (
                      <Ionicons name="checkmark" size={11} color="#FFFFFF" />
                    ) : null}
                  </View>
                  <Text
                    className={cn(
                      'flex-1 text-sm text-ink dark:text-ink-dark',
                      item.isCompleted && 'line-through opacity-60',
                    )}
                  >
                    {item.title}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        {task.tags.length > 0 ? (
          <View className="mb-6 flex-row flex-wrap gap-2">
            {task.tags.map((tag) => (
              <View
                key={tag}
                className="rounded-full bg-surface-elevated px-2.5 py-1 dark:bg-surface-elevated-dark"
              >
                <Text className="text-xs font-medium text-ink-secondary dark:text-ink-dark-secondary">
                  #{tag}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {actionError ? (
          <Text className="mb-3 text-sm text-danger">{actionError}</Text>
        ) : null}

        <View className="gap-3 pb-4">
          <PrimaryButton
            label={task.isCompleted ? 'Mark incomplete' : 'Mark complete'}
            loading={toggleTask.isPending}
            onPress={() => {
              setActionError(null);
              toggleTask.mutate(task.id, {
                onError: (error) => {
                  setActionError(
                    error instanceof Error ? error.message : 'Could not update task status.',
                  );
                },
              });
            }}
          />
          <SecondaryButton label="Edit task" onPress={onEdit} />
          <SecondaryButton
            label="Delete task"
            onPress={() => setConfirmDelete(true)}
            className="border-danger"
          />
        </View>
      </Animated.View>

      <AppModal
        visible={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete task?"
      >
        <Text className="mb-5 text-sm leading-6 text-ink-secondary dark:text-ink-dark-secondary">
          “{task.title}” will be permanently removed. This cannot be undone.
        </Text>
        <View className="gap-3">
          <PrimaryButton
            label="Delete"
            loading={deleteTask.isPending}
            onPress={() => void onDelete()}
          />
          <SecondaryButton
            label="Cancel"
            onPress={() => setConfirmDelete(false)}
            disabled={deleteTask.isPending}
          />
        </View>
      </AppModal>
    </Screen>
  );
}
