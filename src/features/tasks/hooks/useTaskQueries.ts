import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateTaskInput, Task, TaskListFilter, UpdateTaskInput } from '../types';
import { taskKeys } from './query-keys';
import { taskRepository } from '../services/task-repository';
import { cancelTaskReminder, syncTaskReminder } from '@/features/notifications';
import { usePreferencesStore } from '@/store/preferences-store';
import { notificationKeys } from '@/features/notifications';

export function useTasksQuery(filter?: TaskListFilter) {
  return useQuery({
    queryKey: taskKeys.list(filter),
    queryFn: () => taskRepository.list(filter),
  });
}

export function useTaskQuery(id: string | undefined) {
  return useQuery({
    queryKey: taskKeys.detail(id ?? ''),
    queryFn: () => taskRepository.getById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTaskInput) => taskRepository.create(input),
    onSuccess: async (task) => {
      if (usePreferencesStore.getState().notificationsEnabled) {
        await syncTaskReminder(task);
      }
      await queryClient.invalidateQueries({ queryKey: taskKeys.all });
      await queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
      taskRepository.update(id, input),
    onSuccess: async (task, variables) => {
      if (usePreferencesStore.getState().notificationsEnabled) {
        await syncTaskReminder(task);
      }
      await queryClient.invalidateQueries({ queryKey: taskKeys.all });
      await queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.id) });
      await queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useToggleTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => taskRepository.toggleComplete(id),
    onSuccess: async (task, id) => {
      if (usePreferencesStore.getState().notificationsEnabled) {
        await syncTaskReminder(task);
      }
      await queryClient.invalidateQueries({ queryKey: taskKeys.all });
      await queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
      await queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await cancelTaskReminder(id);
      await taskRepository.remove(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: taskKeys.all });
      await queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

function useTrackingMutation(
  action: (id: string, extra?: number) => Promise<Task>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, minutes }: { id: string; minutes?: number }) =>
      action(id, minutes),
    onSuccess: async (task) => {
      await queryClient.invalidateQueries({ queryKey: taskKeys.all });
      await queryClient.invalidateQueries({ queryKey: taskKeys.detail(task.id) });
    },
  });
}

export function useStartTrackingMutation() {
  return useTrackingMutation((id) => taskRepository.trackingStart(id));
}

export function useBreakTrackingMutation() {
  return useTrackingMutation((id, minutes) =>
    taskRepository.trackingBreak(id, minutes),
  );
}

export function useResumeTrackingMutation() {
  return useTrackingMutation((id) => taskRepository.trackingResume(id));
}

export function useEndTrackingMutation() {
  return useTrackingMutation((id) => taskRepository.trackingEnd(id));
}

export function useCompleteTrackingMutation() {
  return useTrackingMutation((id) => taskRepository.trackingComplete(id));
}
