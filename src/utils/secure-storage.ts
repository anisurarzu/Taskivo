import * as SecureStore from 'expo-secure-store';

/**
 * Secure credential storage scaffold.
 * Use for tokens and secrets once auth is implemented.
 */
export const secureStorage = {
  async get(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async set(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  },
  async remove(key: string) {
    await SecureStore.deleteItemAsync(key);
  },
};
