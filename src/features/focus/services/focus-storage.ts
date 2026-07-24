import { appStorage } from '@/utils/storage';
import type { FocusSession } from '../types';

const SESSIONS_KEY = 'taskivo.focus.sessions.v1';

export const focusStorage = {
  load(): FocusSession[] {
    const saved = appStorage.getJSON<FocusSession[]>(SESSIONS_KEY);
    return Array.isArray(saved) ? saved : [];
  },

  save(sessions: FocusSession[]) {
    appStorage.setJSON(SESSIONS_KEY, sessions);
  },

  reset() {
    appStorage.setJSON(SESSIONS_KEY, []);
  },
};
