import { create } from 'zustand';
import { appStorage } from '@/utils/storage';
import { FOCUS_PRESETS_MINUTES } from '@/features/focus';

const PREFS_KEY = 'taskivo.preferences.v1';

export type WeekStart = 'monday' | 'sunday';

export type AppPreferences = {
  hapticsEnabled: boolean;
  notificationsEnabled: boolean;
  defaultFocusMinutes: number;
  weekStartsOn: WeekStart;
};

const defaults: AppPreferences = {
  hapticsEnabled: true,
  notificationsEnabled: true,
  defaultFocusMinutes: 25,
  weekStartsOn: 'monday',
};

interface PreferencesState extends AppPreferences {
  hydrated: boolean;
  hydrate: () => void;
  setHapticsEnabled: (value: boolean) => void;
  setNotificationsEnabled: (value: boolean) => void;
  setDefaultFocusMinutes: (value: number) => void;
  setWeekStartsOn: (value: WeekStart) => void;
}

function persist(next: AppPreferences) {
  appStorage.setJSON(PREFS_KEY, next);
}

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  ...defaults,
  hydrated: false,
  hydrate: () => {
    const saved = appStorage.getJSON<Partial<AppPreferences>>(PREFS_KEY);
    set({
      ...defaults,
      ...saved,
      defaultFocusMinutes: FOCUS_PRESETS_MINUTES.includes(
        (saved?.defaultFocusMinutes ?? 25) as (typeof FOCUS_PRESETS_MINUTES)[number],
      )
        ? (saved?.defaultFocusMinutes as number)
        : 25,
      hydrated: true,
    });
  },
  setHapticsEnabled: (value) => {
    const next = { ...get(), hapticsEnabled: value };
    persist({
      hapticsEnabled: next.hapticsEnabled,
      notificationsEnabled: next.notificationsEnabled,
      defaultFocusMinutes: next.defaultFocusMinutes,
      weekStartsOn: next.weekStartsOn,
    });
    set({ hapticsEnabled: value });
  },
  setNotificationsEnabled: (value) => {
    const next = { ...get(), notificationsEnabled: value };
    persist({
      hapticsEnabled: next.hapticsEnabled,
      notificationsEnabled: next.notificationsEnabled,
      defaultFocusMinutes: next.defaultFocusMinutes,
      weekStartsOn: next.weekStartsOn,
    });
    set({ notificationsEnabled: value });
  },
  setDefaultFocusMinutes: (value) => {
    const minutes = FOCUS_PRESETS_MINUTES.includes(value as (typeof FOCUS_PRESETS_MINUTES)[number])
      ? value
      : 25;
    const next = { ...get(), defaultFocusMinutes: minutes };
    persist({
      hapticsEnabled: next.hapticsEnabled,
      notificationsEnabled: next.notificationsEnabled,
      defaultFocusMinutes: next.defaultFocusMinutes,
      weekStartsOn: next.weekStartsOn,
    });
    set({ defaultFocusMinutes: minutes });
  },
  setWeekStartsOn: (value) => {
    const next = { ...get(), weekStartsOn: value };
    persist({
      hapticsEnabled: next.hapticsEnabled,
      notificationsEnabled: next.notificationsEnabled,
      defaultFocusMinutes: next.defaultFocusMinutes,
      weekStartsOn: next.weekStartsOn,
    });
    set({ weekStartsOn: value });
  },
}));
