import { create } from 'zustand';
import { appStorage } from '@/utils/storage';
import { FOCUS_PRESETS_MINUTES } from '../types';

const LINKED_TASK_KEY = 'taskivo.focus.linkedTask';

type LinkedTask = { id: string; title: string } | null;

interface FocusUiState {
  durationMinutes: number;
  linkedTask: LinkedTask;
  setDurationMinutes: (minutes: number) => void;
  setLinkedTask: (task: LinkedTask) => void;
  hydrate: () => void;
}

export const useFocusUiStore = create<FocusUiState>((set) => ({
  durationMinutes: 25,
  linkedTask: null,
  setDurationMinutes: (minutes) => {
    const next = FOCUS_PRESETS_MINUTES.includes(minutes as (typeof FOCUS_PRESETS_MINUTES)[number])
      ? minutes
      : 25;
    set({ durationMinutes: next });
  },
  setLinkedTask: (task) => {
    if (task) {
      appStorage.setJSON(LINKED_TASK_KEY, task);
    } else {
      appStorage.remove(LINKED_TASK_KEY);
    }
    set({ linkedTask: task });
  },
  hydrate: () => {
    const saved = appStorage.getJSON<{ id: string; title: string }>(LINKED_TASK_KEY);
    if (saved?.id && saved?.title) {
      set({ linkedTask: saved });
    }
  },
}));
