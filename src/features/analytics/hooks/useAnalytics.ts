import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi, getApiErrorMessage, isMockApi } from '@/services/api';
import { useTasksQuery } from '@/features/tasks';
import { useFocusSessionsQuery } from '@/features/focus';
import { buildAnalytics } from '../utils/build-analytics';

export function useAnalytics() {
  const tasksQuery = useTasksQuery();
  const sessionsQuery = useFocusSessionsQuery();

  const remoteQuery = useQuery({
    queryKey: ['analytics', 'monthly'],
    enabled: !isMockApi(),
    queryFn: async () => {
      try {
        const { data } = await analyticsApi.get({ range: 'monthly' });
        return data;
      } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Unable to load analytics'));
      }
    },
    retry: 1,
  });

  const local = useMemo(
    () => buildAnalytics(tasksQuery.data ?? [], sessionsQuery.data ?? []),
    [tasksQuery.data, sessionsQuery.data],
  );

  const remote = remoteQuery.data;

  const insights =
    remote?.insights?.map((item) => ({
      title: item.title,
      value: item.detail,
    })) ?? local.insights;

  return {
    ...local,
    completed: remote?.summary.lifetimeCompleted ?? local.completed,
    streak: remote?.summary.streakDays ?? local.streak,
    insights,
    series: remote?.series ?? [],
    efficiencyPct: remote?.summary.efficiencyPct,
    isLoading: tasksQuery.isLoading || sessionsQuery.isLoading || (!isMockApi() && remoteQuery.isLoading),
    isError: tasksQuery.isError || sessionsQuery.isError,
    refetch: async () => {
      await Promise.all([
        tasksQuery.refetch(),
        sessionsQuery.refetch(),
        remoteQuery.refetch(),
      ]);
    },
  };
}
