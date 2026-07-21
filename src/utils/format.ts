export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions) {
  const value = typeof date === 'string' ? new Date(date) : date;
  return value.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

export function formatTime(date: Date | string) {
  const value = typeof date === 'string' ? new Date(date) : date;
  return value.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function formatRelativeTime(date: Date | string) {
  const value = typeof date === 'string' ? new Date(date) : date;
  const diff = Date.now() - value.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
