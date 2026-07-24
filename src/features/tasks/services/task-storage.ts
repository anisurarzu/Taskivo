import { appStorage } from '@/utils/storage';
import type { Task } from '../types';
import { seedTasks } from './seed';

const TASKS_KEY = 'taskivo.tasks.v1';

export const taskStorage = {
  load(): Task[] {
    const saved = appStorage.getJSON<Task[]>(TASKS_KEY);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    appStorage.setJSON(TASKS_KEY, seedTasks);
    return [...seedTasks];
  },

  save(tasks: Task[]) {
    appStorage.setJSON(TASKS_KEY, tasks);
  },

  reset() {
    appStorage.setJSON(TASKS_KEY, seedTasks);
    return [...seedTasks];
  },
};
