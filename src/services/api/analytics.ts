import { apiClient } from './client';

export type AnalyticsRange = 'daily' | 'monthly' | 'yearly' | 'custom';

export type AnalyticsResponse = {
  range: AnalyticsRange;
  summary: {
    completedTasks: number;
    createdTasks: number;
    openTasks: number;
    lifetimeCompleted: number;
    focusMinutes: number;
    workMinutes: number;
    breakMinutes: number;
    efficiencyPct: number;
    completionRate: number;
    streakDays: number;
  };
  series: Array<{
    key: string;
    label: string;
    completedTasks: number;
    createdTasks: number;
    focusMinutes: number;
    workMinutes: number;
    breakMinutes: number;
    completionRate: number;
  }>;
  insights: Array<{
    title: string;
    detail: string;
    tone: 'up' | 'down' | 'neutral';
  }>;
};

export const analyticsApi = {
  get: (params: { range: AnalyticsRange; from?: string; to?: string }) =>
    apiClient.get<AnalyticsResponse>('/analytics', { params }),
};
