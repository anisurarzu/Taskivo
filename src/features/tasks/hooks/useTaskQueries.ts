import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/task-service';
import type { CreateTaskInput, TaskListFilter, UpdateTaskInput } from '../types';
import { taskKeys } from './query-keys';

export function useTasksQuery(filter?: TaskListFilter) {
  return useQuery({
    queryKey: taskKeys.list(filter),
    queryFn: () => taskService.list(filter),
  });
}

export function useTaskQuery(id: string | undefined) {
  return useQuery({
    queryKey: taskKeys.detail(id ?? ''),
    queryFn: () => taskService.getById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTaskInput) => taskService.create(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
      taskService.update(id, input),
    onSuccess: async (_task, variables) => {
      await queryClient.invalidateQueries({ queryKey: taskKeys.all });
      await queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.id) });
    },
  });
}

export function useToggleTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => taskService.toggleComplete(id),
    onSuccess: async (_task, id) => {
      await queryClient.invalidateQueries({ queryKey: taskKeys.all });
      await queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
    },
  });
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => taskService.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}
