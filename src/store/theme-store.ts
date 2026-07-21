import { create } from 'zustand';
import { appStorage } from '@/utils/storage';
import type { ThemePreference } from '@/types';

const THEME_KEY = 'taskivo.theme';

interface ThemeState {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  hydrate: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  preference: 'system',
  setPreference: (preference) => {
    appStorage.setString(THEME_KEY, preference);
    set({ preference });
  },
  hydrate: () => {
    const saved = appStorage.getString(THEME_KEY) as ThemePreference | undefined;
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      set({ preference: saved });
    }
  },
}));
