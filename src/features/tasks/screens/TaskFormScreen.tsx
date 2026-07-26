import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Screen } from '@/components/common';
import { IconButton, PrimaryButton, SecondaryButton } from '@/components/buttons';
import { AppTextInput } from '@/components/inputs';
import { Loading, EmptyState } from '@/components/ui';
import { CATEGORY_LABELS, PRIORITY_LABELS } from '@/constants';
import type { TaskCategory, TaskSubtask, Priority } from '../types';
import {
  useCreateTaskMutation,
  useTaskQuery,
  useUpdateTaskMutation,
} from '../hooks/useTaskQueries';
import { taskFormSchema, type TaskFormValues } from '../validation/schemas';
import { ChipSelect } from '../components/ChipSelect';
import { DueDateField } from '../components/DueDateField';
import { SubtaskEditor } from '../components/SubtaskEditor';

interface TaskFormScreenProps {
  mode: 'create' | 'edit';
  taskId?: string;
  onBack: () => void;
  onSuccess: (taskId: string) => void;
}

const priorityOptions = (Object.keys(PRIORITY_LABELS) as Priority[]).map((value) => ({
  value,
  label: PRIORITY_LABELS[value],
}));

const categoryOptions = (Object.keys(CATEGORY_LABELS) as TaskCategory[]).map((value) => ({
  value,
  label: CATEGORY_LABELS[value],
}));

function parseTags(text?: string) {
  if (!text?.trim()) return [];
  return text
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function TaskFormScreen({ mode, taskId, onBack, onSuccess }: TaskFormScreenProps) {
  const isEdit = mode === 'edit';
  const { data: task, isLoading, isError, refetch } = useTaskQuery(isEdit ? taskId : undefined);
  const createTask = useCreateTaskMutation();
  const updateTask = useUpdateTaskMutation();
  const [subtasks, setSubtasks] = useState<TaskSubtask[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(!isEdit);

  const { control, handleSubmit, reset } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      category: 'work',
      tagsText: '',
      dueAt: null,
    },
  });

  useEffect(() => {
    if (!isEdit || !task) return;
    reset({
      title: task.title,
      description: task.description ?? '',
      priority: task.priority,
      category: task.category,
      tagsText: task.tags.join(', '),
      dueAt: task.dueAt ?? null,
    });
    setSubtasks(task.subtasks);
    setHydrated(true);
  }, [isEdit, task, reset]);

  const submitting = createTask.isPending || updateTask.isPending;

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const description = values.description?.trim() || undefined;
    const tags = parseTags(values.tagsText);
    const dueAt = values.dueAt ?? null;

    try {
      if (isEdit && taskId) {
        const updated = await updateTask.mutateAsync({
          id: taskId,
          input: {
            title: values.title,
            description: description ?? null,
            priority: values.priority,
            category: values.category,
            tags,
            dueAt,
            subtasks,
          },
        });
        onSuccess(updated.id);
        return;
      }

      const created = await createTask.mutateAsync({
        title: values.title,
        description,
        priority: values.priority,
        category: values.category,
        tags,
        dueAt,
        subtasks: subtasks.map(({ title, isCompleted }) => ({ title, isCompleted })),
      });
      onSuccess(created.id);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Something went wrong. Try again.');
    }
  });

  if (isEdit && isLoading) {
    return (
      <Screen>
        <Loading fullScreen label="Loading task..." />
      </Screen>
    );
  }

  if (isEdit && (isError || !task)) {
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

  if (!hydrated) {
    return (
      <Screen>
        <Loading fullScreen label="Loading form..." />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Animated.View entering={FadeInDown.duration(400)} className="pt-2">
        <View className="mb-6 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <IconButton name="close" onPress={onBack} className="-ml-2" />
            <Text className="ml-1 text-2xl font-bold text-ink dark:text-ink-dark">
              {isEdit ? 'Edit task' : 'New task'}
            </Text>
          </View>
        </View>

        <View className="mb-4 gap-4">
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <AppTextInput
                label="Title"
                placeholder="What needs to be done?"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <AppTextInput
                label="Notes"
                placeholder="Add details, context, or links..."
                value={value ?? ''}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                error={error?.message}
                className="min-h-[96px] py-3"
              />
            )}
          />
        </View>

        <Controller
          control={control}
          name="priority"
          render={({ field: { value, onChange } }) => (
            <ChipSelect
              label="Priority"
              options={priorityOptions}
              value={value}
              onChange={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="category"
          render={({ field: { value, onChange } }) => (
            <ChipSelect
              label="Category"
              options={categoryOptions}
              value={value}
              onChange={onChange}
              activeClassName="bg-primary"
            />
          )}
        />

        <Controller
          control={control}
          name="dueAt"
          render={({ field: { value, onChange } }) => (
            <DueDateField value={value} onChange={onChange} />
          )}
        />

        <Controller
          control={control}
          name="tagsText"
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <AppTextInput
              label="Tags"
              placeholder="work, deep-focus, client"
              value={value ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
              error={error?.message}
              containerClassName="mb-4"
            />
          )}
        />

        <SubtaskEditor value={subtasks} onChange={setSubtasks} />

        {formError ? (
          <Text className="mb-3 text-sm text-danger dark:text-danger">{formError}</Text>
        ) : null}

        <View className="gap-3 pb-4">
          <PrimaryButton
            label={isEdit ? 'Save changes' : 'Create task'}
            loading={submitting}
            onPress={() => void onSubmit()}
          />
          <SecondaryButton label="Cancel" onPress={onBack} disabled={submitting} />
        </View>
      </Animated.View>
    </Screen>
  );
}
