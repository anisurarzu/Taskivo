import { create } from 'zustand';
import { appStorage } from '@/utils/storage';

const ONBOARDING_KEY = 'taskivo.onboarding.completed';
const AUTH_KEY = 'taskivo.auth.session';

interface AuthState {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  isHydrated: boolean;
  hydrate: () => void;
  completeOnboarding: () => void;
  signIn: () => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  isHydrated: false,
  hydrate: () => {
    const onboarding = appStorage.getString(ONBOARDING_KEY) === 'true';
    const session = appStorage.getString(AUTH_KEY) === 'true';
    set({
      hasCompletedOnboarding: onboarding,
      isAuthenticated: session,
      isHydrated: true,
    });
  },
  completeOnboarding: () => {
    appStorage.setString(ONBOARDING_KEY, 'true');
    set({ hasCompletedOnboarding: true });
  },
  signIn: () => {
    appStorage.setString(AUTH_KEY, 'true');
    set({ isAuthenticated: true });
  },
  signOut: () => {
    appStorage.remove(AUTH_KEY);
    set({ isAuthenticated: false });
  },
}));
