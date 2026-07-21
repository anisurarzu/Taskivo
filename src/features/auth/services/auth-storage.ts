import { secureStorage } from '@/utils/secure-storage';
import { appStorage } from '@/utils/storage';
import type { AuthSession, AuthTokens, AuthUser } from '../types';

const SESSION_KEY = 'taskivo.auth.session';
const TOKENS_KEY = 'taskivo.auth.tokens';
const ONBOARDING_KEY = 'taskivo.onboarding.completed';
const REMEMBER_KEY = 'taskivo.auth.remember';

export const authStorage = {
  async saveSession(session: AuthSession) {
    appStorage.setJSON(SESSION_KEY, session.user);
    appStorage.setString(REMEMBER_KEY, session.rememberMe ? 'true' : 'false');
    await secureStorage.set(TOKENS_KEY, JSON.stringify(session.tokens));
  },

  async getSession(): Promise<AuthSession | null> {
    const user = appStorage.getJSON<AuthUser>(SESSION_KEY);
    const tokenRaw = await secureStorage.get(TOKENS_KEY);
    if (!user || !tokenRaw) return null;
    try {
      const tokens = JSON.parse(tokenRaw) as AuthTokens;
      const rememberMe = appStorage.getString(REMEMBER_KEY) === 'true';
      return { user, tokens, rememberMe };
    } catch {
      return null;
    }
  },

  async clearSession() {
    appStorage.remove(SESSION_KEY);
    appStorage.remove(REMEMBER_KEY);
    await secureStorage.remove(TOKENS_KEY);
  },

  getOnboardingCompleted() {
    return appStorage.getString(ONBOARDING_KEY) === 'true';
  },

  setOnboardingCompleted() {
    appStorage.setString(ONBOARDING_KEY, 'true');
  },
};
