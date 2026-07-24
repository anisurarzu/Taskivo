import type { FocusSession } from '../types';

export function getTotalFocusSeconds(sessions: FocusSession[]) {
  return sessions
    .filter((session) => session.status === 'completed')
    .reduce((sum, session) => sum + session.completedSeconds, 0);
}

export function getFocusSecondsThisWeek(sessions: FocusSession[], now = new Date()) {
  const start = new Date(now);
  const day = start.getDay(); // 0 Sun
  const mondayOffset = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + mondayOffset);
  start.setHours(0, 0, 0, 0);

  return sessions
    .filter((session) => {
      if (session.status !== 'completed') return false;
      return new Date(session.startedAt).getTime() >= start.getTime();
    })
    .reduce((sum, session) => sum + session.completedSeconds, 0);
}

export function getFocusStreakDays(sessions: FocusSession[], now = new Date()) {
  const completedDays = new Set(
    sessions
      .filter((session) => session.status === 'completed' && session.completedSeconds >= 60)
      .map((session) => {
        const d = new Date(session.startedAt);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      }),
  );

  let streak = 0;
  const cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);

  while (true) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
    if (!completedDays.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function formatFocusDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours <= 0) return `${minutes}m`;
  if (minutes <= 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}
