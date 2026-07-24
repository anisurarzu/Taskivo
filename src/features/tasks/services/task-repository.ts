import { isMockApi } from '@/services/api/config';
import { taskApi } from '../api/task-api';
import { taskService } from './task-service';
import type { CreateTaskInput, Task, TaskListFilter, UpdateTaskInput } from '../types';

/**
 * Single entry for task data access.
 * Mock by default; set EXPO_PUBLIC_USE_MOCK_API=false to use Axios API.
 */
export const taskRepository = {
  list(filter?: TaskListFilter): Promise<Task[]> {
    if (isMockApi()) return taskService.list(filter);
    return taskApi.list(filter).then((res) => res.data as Task[]);
  },

  getById(id: string): Promise<Task | null> {
    if (isMockApi()) return taskService.getById(id);
    return taskApi.getById(id).then((res) => res.data as Task);
  },

  create(input: CreateTaskInput): Promise<Task> {
    if (isMockApi()) return taskService.create(input);
    return taskApi.create(input).then((res) => res.data as Task);
  },

  update(id: string, input: UpdateTaskInput): Promise<Task> {
    if (isMockApi()) return taskService.update(id, input);
    return taskApi.update(id, input).then((res) => res.data as Task);
  },

  toggleComplete(id: string): Promise<Task> {
    if (isMockApi()) return taskService.toggleComplete(id);
    return taskApi.toggleComplete(id).then((res) => res.data as Task);
  },

  remove(id: string): Promise<void> {
    if (isMockApi()) return taskService.remove(id);
    return taskApi.remove(id).then(() => undefined);
  },
};
