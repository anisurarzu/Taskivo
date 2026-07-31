import { getApiErrorMessage, isMockApi } from '@/services/api';
import { taskApi } from '../api/task-api';
import { taskService } from './task-service';
import type { CreateTaskInput, Task, TaskListFilter, UpdateTaskInput } from '../types';

/**
 * Task data access — shared Taskivo-Web backend when mock is off.
 */
export const taskRepository = {
  async list(filter?: TaskListFilter): Promise<Task[]> {
    if (isMockApi()) return taskService.list(filter);
    try {
      const { data } = await taskApi.list(filter);
      return data as Task[];
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Unable to load tasks'));
    }
  },

  async getById(id: string): Promise<Task | null> {
    if (isMockApi()) return taskService.getById(id);
    try {
      const { data } = await taskApi.getById(id);
      return data as Task;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Unable to load task'));
    }
  },

  async create(input: CreateTaskInput): Promise<Task> {
    if (isMockApi()) return taskService.create(input);
    try {
      const { data } = await taskApi.create(input);
      return data as Task;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Unable to create task'));
    }
  },

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    if (isMockApi()) return taskService.update(id, input);
    try {
      const { data } = await taskApi.update(id, input);
      return data as Task;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Unable to update task'));
    }
  },

  async toggleComplete(id: string): Promise<Task> {
    if (isMockApi()) return taskService.toggleComplete(id);
    try {
      const { data } = await taskApi.toggleComplete(id);
      return data as Task;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Unable to update task'));
    }
  },

  async remove(id: string): Promise<void> {
    if (isMockApi()) return taskService.remove(id);
    try {
      await taskApi.remove(id);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Unable to delete task'));
    }
  },
  async trackingStart(id: string): Promise<Task> {
    if (isMockApi()) throw new Error('Tracking requires live API');
    try {
      const { data } = await taskApi.trackingStart(id);
      return data as Task;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Unable to start tracking'));
    }
  },

  async trackingBreak(id: string, plannedBreakMinutes?: number): Promise<Task> {
    if (isMockApi()) throw new Error('Tracking requires live API');
    try {
      const { data } = await taskApi.trackingBreak(id, { plannedBreakMinutes });
      return data as Task;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Unable to start break'));
    }
  },

  async trackingResume(id: string): Promise<Task> {
    if (isMockApi()) throw new Error('Tracking requires live API');
    try {
      const { data } = await taskApi.trackingResume(id);
      return data as Task;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Unable to resume'));
    }
  },

  async trackingEnd(id: string): Promise<Task> {
    if (isMockApi()) throw new Error('Tracking requires live API');
    try {
      const { data } = await taskApi.trackingEnd(id);
      return data as Task;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Unable to end tracking'));
    }
  },

  async trackingComplete(id: string): Promise<Task> {
    if (isMockApi()) throw new Error('Tracking requires live API');
    try {
      const { data } = await taskApi.trackingComplete(id);
      return data as Task;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Unable to complete tracking'));
    }
  },
};
