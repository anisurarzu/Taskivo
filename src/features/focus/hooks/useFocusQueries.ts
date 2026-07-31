import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { focusService } from '../services/focus-service';
import type { CreateFocusSessionInput, FocusSession } from '../types';
import { isMockApi } from '@/services/api/config';
import { focusApi } from '../api/focus-api';
import { notificationService, notificationKeys } from '@/features/notifications';
import { formatFocusDuration } from '../utils/selectors';

export const focusKeys = {
  all: ['focus'] as const,
  sessions: () => [...focusKeys.all, 'sessions'] as const,
};

async function listSessions(): Promise<FocusSession[]> {
  if (isMockApi()) return focusService.list();
  try {
    const { data } = await focusApi.list();
    return data as FocusSession[];
  } catch (error) {
    const { getApiErrorMessage } = await import('@/services/api');
    throw new Error(getApiErrorMessage(error, 'Unable to load focus sessions'));
  }
}

async function createSession(input: CreateFocusSessionInput): Promise<FocusSession> {
  if (isMockApi()) return focusService.create(input);
  try {
    const { data } = await focusApi.create(input);
    return data as FocusSession;
  } catch (error) {
    const { getApiErrorMessage } = await import('@/services/api');
    throw new Error(getApiErrorMessage(error, 'Unable to save focus session'));
  }
}

export function useFocusSessionsQuery() {
  return useQuery({
    queryKey: focusKeys.sessions(),
    queryFn: listSessions,
  });
}

export function useCreateFocusSessionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSession,
    onSuccess: async (session) => {
      if (session.status === 'completed') {
        notificationService.pushFeed({
          title: 'Focus session complete',
          body: `You focused for ${formatFocusDuration(session.completedSeconds)}${
            session.taskTitle ? ` on “${session.taskTitle}”` : ''
          }.`,
          type: 'focus_complete',
          relatedId: session.id,
        });
      }
      await queryClient.invalidateQueries({ queryKey: focusKeys.all });
      await queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
