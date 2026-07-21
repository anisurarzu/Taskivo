type StorageLike = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  delete: (key: string) => void;
};

const memoryStore = new Map<string, string>();

const memoryStorage: StorageLike = {
  getString: (key) => memoryStore.get(key),
  set: (key, value) => {
    memoryStore.set(key, value);
  },
  delete: (key) => {
    memoryStore.delete(key);
  },
};

function createStorage(): StorageLike {
  try {
    // MMKV needs a custom native build; fall back in Expo Go.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mmkvModule = require('react-native-mmkv') as {
      MMKV?: new (options?: { id?: string }) => StorageLike;
      createMMKV?: (options?: { id?: string }) => StorageLike;
    };

    if (typeof mmkvModule.createMMKV === 'function') {
      return mmkvModule.createMMKV({ id: 'taskivo-storage' });
    }

    if (typeof mmkvModule.MMKV === 'function') {
      return new mmkvModule.MMKV({ id: 'taskivo-storage' });
    }

    return memoryStorage;
  } catch {
    return memoryStorage;
  }
}

const storage = createStorage();

export const appStorage = {
  getString: (key: string) => {
    try {
      return storage.getString(key);
    } catch {
      return memoryStorage.getString(key);
    }
  },
  setString: (key: string, value: string) => {
    try {
      storage.set(key, value);
    } catch {
      memoryStorage.set(key, value);
    }
  },
  remove: (key: string) => {
    try {
      storage.delete(key);
    } catch {
      memoryStorage.delete(key);
    }
  },
  getJSON: <T>(key: string): T | null => {
    const value = appStorage.getString(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  },
  setJSON: <T>(key: string, value: T) => {
    appStorage.setString(key, JSON.stringify(value));
  },
};
