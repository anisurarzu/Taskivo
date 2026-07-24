import { create } from 'zustand';
import type { Priority, TaskCategory, TaskStatus } from '../types';

type StatusFilter = TaskStatus | 'active' | 'all';

interface TaskUiState {
  searchQuery: string;
  statusFilter: StatusFilter;
  categoryFilter: TaskCategory | null;
  priorityFilter: Priority | null;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: StatusFilter) => void;
  setCategoryFilter: (category: TaskCategory | null) => void;
  setPriorityFilter: (priority: Priority | null) => void;
  resetFilters: () => void;
}

export const useTaskUiStore = create<TaskUiState>((set) => ({
  searchQuery: '',
  statusFilter: 'all',
  categoryFilter: null,
  priorityFilter: null,
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setPriorityFilter: (priorityFilter) => set({ priorityFilter }),
  resetFilters: () =>
    set({
      searchQuery: '',
      statusFilter: 'all',
      categoryFilter: null,
      priorityFilter: null,
    }),
}));
