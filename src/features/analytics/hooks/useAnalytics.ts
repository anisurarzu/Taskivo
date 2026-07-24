import { useMemo } from 'react';
import { useTasksQuery } from '@/features/tasks';
import { useFocusSessionsQuery } from '@/features/focus';
import { buildAnalytics } from '../utils/build-analytics';

export function useAnalytics() {
  const tasksQuery = useTasksQuery();
  const sessionsQuery = useFocusSessionsQuery();

  const analytics = useMemo(
    () => buildAnalytics(tasksQuery.data ?? [], sessionsQuery.data ?? []),
    [tasksQuery.data, sessionsQuery.data],
  );

  return {
    ...analytics,
    isLoading: tasksQuery.isLoading || sessionsQuery.isLoading,
    isError: tasksQuery.isError || sessionsQuery.isError,
    refetch: async () => {
      await Promise.all([tasksQuery.refetch(), sessionsQuery.refetch()]);
    },
  };
}
