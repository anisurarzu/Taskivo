import { Platform } from 'react-native';
import { appStorage } from '@/utils/storage';
import type { AppNotification } from '../types';

const FEED_KEY = 'taskivo.notifications.feed.v1';
const REMINDER_MAP_KEY = 'taskivo.notifications.reminders.v1';

type ReminderMap = Record<string, string>; // taskId -> notificationId

let Notifications: typeof import('expo-notifications') | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Notifications = require('expo-notifications');
  Notifications?.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch {
  Notifications = null;
}

export const notificationStorage = {
  loadFeed(): AppNotification[] {
    const saved = appStorage.getJSON<AppNotification[]>(FEED_KEY);
    return Array.isArray(saved) ? saved : [];
  },
  saveFeed(items: AppNotification[]) {
    appStorage.setJSON(FEED_KEY, items);
  },
  loadReminders(): ReminderMap {
    return appStorage.getJSON<ReminderMap>(REMINDER_MAP_KEY) ?? {};
  },
  saveReminders(map: ReminderMap) {
    appStorage.setJSON(REMINDER_MAP_KEY, map);
  },
};

function createId(prefix = 'notif') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export const notificationService = {
  async requestPermissions() {
    if (!Notifications || Platform.OS === 'web') {
      return { granted: false };
    }
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return { granted: true };
    const requested = await Notifications.requestPermissionsAsync();
    return { granted: Boolean(requested.granted) };
  },

  async scheduleLocal(title: string, body: string, date: Date) {
    if (!Notifications || Platform.OS === 'web') {
      return { id: '' };
    }
    if (date.getTime() <= Date.now() + 1500) {
      return { id: '' };
    }
    const { granted } = await this.requestPermissions();
    if (!granted) return { id: '' };

    const id = await Notifications.scheduleNotificationAsync({
      content: { title, body, sound: true },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
      },
    });
    return { id };
  },

  async cancel(id: string) {
    if (!Notifications || !id) return;
    await Notifications.cancelScheduledNotificationAsync(id);
  },

  async cancelAll() {
    if (!Notifications) return;
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  listFeed(): AppNotification[] {
    return notificationStorage
      .loadFeed()
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  pushFeed(partial: Omit<AppNotification, 'id' | 'createdAt' | 'read'> & { id?: string }) {
    const item: AppNotification = {
      id: partial.id ?? createId(),
      title: partial.title,
      body: partial.body,
      type: partial.type,
      relatedId: partial.relatedId,
      createdAt: new Date().toISOString(),
      read: false,
    };
    const next = [item, ...notificationStorage.loadFeed()].slice(0, 50);
    notificationStorage.saveFeed(next);
    return item;
  },

  markAllRead() {
    const next = notificationStorage.loadFeed().map((item) => ({ ...item, read: true }));
    notificationStorage.saveFeed(next);
  },

  clearFeed() {
    notificationStorage.saveFeed([]);
  },
};
