/**
 * Notifications scaffold — wire permission + scheduling when features land.
 */
export const notificationService = {
  async requestPermissions() {
    return { granted: false as boolean };
  },
  async scheduleLocal(_title: string, _body: string, _date: Date) {
    return { id: '' };
  },
  async cancelAll() {
    return;
  },
};
